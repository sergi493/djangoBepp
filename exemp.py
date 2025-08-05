import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker('es_ES')

# Generador SQL para 20 Productos
productos_sql = []
for i in range(1, 21):
    nombre = fake.word().capitalize()
    codigo = f"PROD-{1000 + i}"
    cantidad = random.randint(1, 50)
    descripcion = fake.sentence(nb_words=5)
    precio = round(random.uniform(1, 100), 2)
    imagen = f"imagenes/{fake.file_name(extension='jpg')}"
    preu_distribuidor = round(precio * random.uniform(0.5, 0.9), 2)
    marge = round(precio - preu_distribuidor, 2)

    sql_line = f"""INSERT INTO producto (nombre, codigo, cantidad, descripcion, precio, imagen, preu_distribuidor, marge)
VALUES ('{nombre}', '{codigo}', {cantidad}, '{descripcion}', {precio}, '{imagen}', {preu_distribuidor}, {marge});"""
    productos_sql.append(sql_line)

# Generador SQL para 20 Personas
personas_sql = []
for i in range(1, 21):
    nombre = fake.name()
    localidad = fake.city()
    calle = fake.street_address()
    nif = f"{random.randint(10000000, 99999999)}{random.choice('TRWAGMYFPDXBNJZSQVHLCKE')}"
    telefono = fake.random_int(min=600000000, max=699999999)
    email = fake.email()
    comp_banc = fake.iban()
    direccion = f"{calle}, {localidad}"

    sql_line = f"""INSERT INTO persona (nombre, localidad, calle, nif, telefono, email, comp_banc, direccion)
VALUES ('{nombre}', '{localidad}', '{calle}', '{nif}', {telefono}, '{email}', '{comp_banc}', '{direccion}');"""
    personas_sql.append(sql_line)

# Mostrar resultados
import pandas as pd
import ace_tools as tools

df_productos = pd.DataFrame(productos_sql, columns=["SQL INSERT Producto"])
df_personas = pd.DataFrame(personas_sql, columns=["SQL INSERT Persona"])

tools.display_dataframe_to_user(name="Inserts SQL: Producto y Persona", dataframe=pd.concat([df_productos, df_personas], axis=1))
