# Reimportar dependencias tras reinicio
from faker import Faker
import pandas as pd
import random

faker = Faker('es_ES')
num_entries = 2371

# Funciones auxiliares
def generar_nif():
    letras = "TRWAGMYFPDXBNJZSQVHLCKE"
    numero = random.randint(10000000, 99999999)
    letra = letras[numero % 23]
    return f"{numero}{letra}"

def generar_iban():
    pais = "ES"
    digito_control = str(random.randint(10, 99))
    banco = ''.join([str(random.randint(0, 9)) for _ in range(20)])
    return f"{pais}{digito_control}{banco}"

# Poblaciones del Priorat y alrededores
poblaciones = [
    "Móra d'Ebre", "El Masroig", "Falset", "Benissanet", "Móra la Nova", 
    "Gratallops", "Els Guiamets", "Capçanes", "Marçà", "El Molar",
    "La Figuera", "La Torre de l'Espanyol", "Vinebre", "Garcia", "Miravet",
    "Tivissa", "La Palma d'Ebre", "Rasquera", "Bovera", "Ascó", "Flix",
    "Tarragona", "Reus", "Valls", "Amposta", "Tortosa", "Cambrils", "Salou", "La Selva del Camp", "Constantí",
    "El Perelló", "L'Ametlla de Mar","Guiamets"
]

# 160 nombres (doble de lista anterior, con nombres en catalán y castellano)
nombres = [
    # Catalanes
    "Jordi", "Oriol", "Pau", "Arnau", "Nil", "Biel", "Pol", "Roger", "Guillem", "Hug",
    "Carla", "Laia", "Mireia", "Núria", "Júlia", "Aina", "Clàudia", "Ariadna", "Bruna", "Ona",
    "Neus", "Joana", "Estel", "Marina", "Elna", "Martina", "Valèria", "Helena", "Laureta", "Roc",
    # Castellanos/Españoles
    "Carlos", "Daniel", "Iván", "Mario", "Sergio", "David", "Rubén", "Álvaro", "Alejandro", "Andrés",
    "Manuel", "Raúl", "Jaime", "Mateo", "Tomás", "Julio", "Samuel", "Liam", "Gabriel", "Ignacio",
    "Sara", "Bea", "Patricia", "Andrea", "Eva", "Natalia", "Ángela", "Clara", "Rebeca", "Vanesa",
    "Lucía", "Paula", "Raquel", "Noa", "Lara", "Isabel", "Lorena", "Irene", "Sofía", "Verónica",
    # Extras
    "Unai", "Izan", "Thiago", "Eric", "Leo", "Isaac", "Adrià", "Martí", "Eduard", "Joel",
    "Judith", "Lídia", "Blanca", "Berta", "Irina", "Gemma", "Noelia", "Carolina", "Lourdes", "Nerea",
    "Marta", "Teresa", "Ainhoa", "Esther", "Sílvia", "Jana", "Ariadne", "Olga", "Gisela", "Abril",
    "Elisabet", "Alba", "Xènia", "Mònica", "Txell", "Miquel", "Albert", "Enric", "Francesc", "Salvador",
    "Montserrat", "Josep", "Eulàlia", "Ferran", "Esteve", "Núria", "Ramona", "Agustí", "Cristina", "Pere",
    "Xavier", "Ignasi", "Ramon", "Carme", "Assumpció", "Antoni", "Eva Maria", "Maria del Mar", "Neus", "Lluís"
]

# 210 apellidos (triple de base, mezcla catalana y española)
apellidos = [
    # Catalanes típicos
    "Giné", "Ferrer", "Pujol", "Serra", "Sabaté", "Miró", "Vila", "Solé", "Tarragó", "Castellví",
    "Roig", "Abelló", "Font", "Rovira", "Calvet", "Costa", "Franch", "Garriga", "Llorens", "Martorell",
    "Noguera", "Padró", "Quintana", "Riba", "Salvador", "Tortosa", "Urgell", "Vendrell", "Ximenis", "Aragonès",
    "Bonet", "Camps", "Dalmau", "Escoda", "Fàbregas", "Galí", "Homar", "Jové", "Milà", "Noguer",
    "Queralt", "Solsona", "Trullols", "Valls", "Barrufet", "Canals", "Eroles", "Ferreruela", "Infante", "Juncosa",
    "Llagostera", "Ollé", "Querol", "Rosell", "Teixidó", "Vilalta", "Espinós", "Campmany", "Castells", "Vilaseca",
    "Gironès", "Coll", "Marquès", "Casals", "Codina", "Boix", "Grau", "Cabré", "Clarós", "Torras",
    # Españoles comunes
    "García", "Martínez", "Sánchez", "López", "Fernández", "Rodríguez", "Ruiz", "Moreno", "Muñoz", "Romero",
    "Jiménez", "Navarro", "Torres", "Domínguez", "Delgado", "Herrera", "Ibáñez", "Oliver", "Ortega", "Pérez",
    "Ramos", "Urbina", "Zamora", "Zorrilla", "Díaz", "Gómez", "Hernández", "Iglesias", "Kaiser", "Moral",
    "Naval", "Pau", "Salas", "Aguado", "Duran", "Reyes", "Alonso", "Castro", "Cano", "Peña",
    "Rey", "Cortés", "Nieto", "Fuentes", "Vega", "Molina", "Del Río", "Campos", "León", "Marín",
    "Rubio", "Silva", "Ordoñez", "Crespo", "Esteban", "Soto", "Ibáñez", "Suárez", "Blanco", "Bravo",
    # Extras raros o compuestos
    "de la Fuente", "Sanmartí", "Puigdemont", "Xargay", "Montserrat", "Deulofeu", "Vilaró", "Espelt", "Masip", "Besalú",
    "Figueres", "Muntané", "Aznar", "Ripoll", "Tresserras", "Montseny", "Cardona", "Casamitjana", "Tarrés", "Benach"
]

# Generar datos
data = []
for _ in range(num_entries):
    nombre_completo = f"{random.choice(nombres)} {random.choice(apellidos)} {random.choice(apellidos)}"
    email = faker.email()
    nif = generar_nif()
    direccion = faker.street_address()
    poblacion = random.choice(poblaciones)
    cp = faker.postcode()
    iban = generar_iban()
    telefono = faker.phone_number()

    data.append({
        "Nombre completo": nombre_completo,
        "Correo electrónico": email,
        "NIF": nif,
        "Dirección": direccion,
        "Población": poblacion,
        "Código Postal": cp,
        "Cuenta Bancaria (IBAN)": iban,
        "Teléfono": telefono
    })

# Guardar Excel
df = pd.DataFrame(data)
output_path = "/mnt/data/datos_nombres_doble_apellidos_triple.xlsx"
df.to_excel(output_path, index=False)

output_path
