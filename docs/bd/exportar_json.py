"""
Exporta cada tabla de la base facuLeaks a data/<tabla>.json.

Equivale a ejecutar SELECT * FROM <tabla> ORDER BY <clave primaria> y
guardar el resultado como un arreglo de objetos JSON cuyas claves son
exactamente los nombres de columna del esquema (facuLeaks_ae2.sql).

Unica exclusion: usuarios.contrasena_cifrada, que ningun SELECT publico
deberia devolver al navegador.

Conversiones de tipo:
  DECIMAL  -> numero (precio, precio_unitario)
  DATETIME -> texto ISO 8601 "AAAA-MM-DDTHH:MM:SS" (interpretable por Date en JS)
  NULL     -> null

Uso (con la base cargada: facuLeaks_ae2.sql + datos_prueba_ae2.sql):
  pip install pymysql
  python docs/bd/exportar_json.py
  (opcionales: DB_HOST, DB_USER, DB_PASS, DB_SOCKET)
"""
import datetime
import os
import decimal
import json
import pathlib

import pymysql

TABLAS = {
    "roles":         "id_rol",
    "usuarios":      "id_usuario",
    "carreras":      "id_carrera",
    "materias":      "id_materia",
    "estudia":       "id_usuario, id_carrera",
    "dicta":         "id_carrera, id_materia",
    "contenidos":    "id_contenido",
    "publicaciones": "id_contenido",
    "comentarios":   "id_contenido",
    "vota":          "id_usuario, id_contenido",
    "reporta":       "id_usuario, id_contenido",
    "productos":     "id_producto",
    "ventas":        "id_venta",
    "detalla":       "id_venta, id_producto",
}
EXCLUIDAS = {"usuarios": {"contrasena_cifrada"}}

DESTINO = pathlib.Path(__file__).resolve().parents[2] / "data"


def a_json(valor):
    if isinstance(valor, decimal.Decimal):
        return int(valor) if valor == valor.to_integral_value() else float(valor)
    if isinstance(valor, datetime.datetime):
        return valor.strftime("%Y-%m-%dT%H:%M:%S")
    return valor


def main():
    # Credenciales por variables de entorno; por defecto, root sin clave (XAMPP)
    parametros = dict(host=os.getenv("DB_HOST", "localhost"),
                      user=os.getenv("DB_USER", "root"),
                      password=os.getenv("DB_PASS", ""),
                      database="facuLeaks", charset="utf8mb4",
                      cursorclass=pymysql.cursors.DictCursor)
    if os.getenv("DB_SOCKET"):
        parametros["unix_socket"] = os.getenv("DB_SOCKET")
    conexion = pymysql.connect(**parametros)
    DESTINO.mkdir(exist_ok=True)
    with conexion.cursor() as cursor:
        for tabla, orden in TABLAS.items():
            cursor.execute(f"SELECT * FROM {tabla} ORDER BY {orden}")
            filas = [
                {col: a_json(val) for col, val in fila.items()
                 if col not in EXCLUIDAS.get(tabla, set())}
                for fila in cursor.fetchall()
            ]
            ruta = DESTINO / f"{tabla}.json"
            ruta.write_text(json.dumps(filas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"{ruta.name:20} {len(filas):3} filas")
    conexion.close()


if __name__ == "__main__":
    main()
