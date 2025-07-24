import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pandas as pd
import time
import os

base_url   = "https://www.meteo.cat/observacions/xema/dades?codi=WJ&dia={}"
start_date = datetime(2000, 6, 20)
end_date   = datetime.today()

def get_soup_with_retries(url, retries=3, delay=2):
    for intento in range(1, retries+1):
        try:
            r = requests.get(url, timeout=10)
            r.raise_for_status()
            return BeautifulSoup(r.text, "html.parser")
        except Exception as e:
            print(f"🔁 Reintento {intento}/{retries} → {e}")
            time.sleep(delay)
    return None

def parse_float(val):
    """Devuelve float o None si no es convertible."""
    clean = val.replace("°C","").replace("mm","").replace(",",".").strip().lower()
    if clean in ("", "sense dades", "-", "nd"):
        return None
    try:
        return float(clean)
    except ValueError:
        return None

def parse_int(val):
    """Devuelve int o None si no es convertible."""
    clean = val.replace("%","").strip().lower()
    if clean in ("", "sense dades", "-", "nd"):
        return None
    try:
        return int(clean)
    except ValueError:
        return None

dades_per_any = {}

for delta in range((end_date - start_date).days + 1):
    dia      = start_date + timedelta(days=delta)
    date_str = dia.strftime("%Y-%m-%dT10:00Z")
    url      = base_url.format(date_str)
    soup     = get_soup_with_retries(url)
    if not soup:
        print(f"❌ Fallo acceso {dia.date()}")
        continue

    dades = {
        "Data": dia.date(),
        "Temp_mitjana": None,
        "Temp_maxima": None,
        "Temp_minima": None,
        "Humitat": None,
        "Pluja": None,
        "Vent_max": None,
        "Direccio_vent": None,
        "Hores_vent_>=16": 0,
        "Incompletes": True
    }

    # → Extraer Resum diari
    for table in soup.find_all("table"):
        if "Temperatura mitjana" in table.get_text():
            for fila in table.find_all("tr"):
                th = fila.find(["th","td"])
                tds = fila.find_all("td")
                if not th or not tds: 
                    continue
                label = th.text.strip().lower()
                val   = tds[-1].text.strip()
                if "temperatura mitjana" in label:
                    dades["Temp_mitjana"] = parse_float(val)
                elif "temperatura màxima" in label:
                    dades["Temp_maxima"] = parse_float(val)
                elif "temperatura mínima" in label:
                    dades["Temp_minima"] = parse_float(val)
                elif "humitat" in label:
                    dades["Humitat"] = parse_int(val)
                elif "precipitació" in label:
                    dades["Pluja"] = parse_float(val)
                elif "ratxa màxima" in label:
                    vent = parse_float(val)
                    dades["Vent_max"] = vent
                    # dirección tras “–” o “-”
                    if "–" in val or "-" in val:
                        direc = val.replace("–","-").split("-")[-1]
                        dades["Direccio_vent"] = direc.replace("°","").strip()
            break

    # Marcar incompletos si falta temperatura mitjana
    dades["Incompletes"] = dades["Temp_mitjana"] is None

    # → Contar horas viento ≥16 en tabla horaria
    for table in soup.find_all("table"):
        headers = [th.text.strip().lower() for th in table.select("thead th")]
        if "velocitat mitjana de vent (km/h)" in headers:
            idx_vent = headers.index("velocitat mitjana de vent (km/h)")
            for fila in table.select("tbody tr"):
                cols = [td.text.strip().replace(",",".") for td in fila.find_all("td")]
                vel = parse_float(cols[idx_vent])
                if vel is not None and vel >= 16:
                    dades["Hores_vent_>=16"] += 1
            break

    anyo = dia.year
    dades_per_any.setdefault(anyo, []).append(dades)
    flag = "⚠️" if dades["Incompletes"] else ""
    print(f"✅ {dia.date()} añadido {flag}")
    print(dades)
    time.sleep(0.5)

# → Guardar por año
out_dir = "/mnt/data/meteo_masroig_excels/"
os.makedirs(out_dir, exist_ok=True)
for anyo, lista in dades_per_any.items():
    df   = pd.DataFrame(lista)
    path = os.path.join(out_dir, f"masroig_{anyo}.xlsx")
    df.to_excel(path, index=False)
    print(f"💾 Guardado {path}")

# Mostrar ejemplo 2000
import ace_tools as tools
tools.display_dataframe_to_user(
    name="Dades 2000",
    dataframe=pd.DataFrame(dades_per_any.get(2000, []))
)
