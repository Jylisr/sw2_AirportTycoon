import mysql.connector
from mysql.connector.types import RowType
from typing import List

connection = mysql.connector.connect(
    host="127.0.0.1",
    port=3306,
    database="flight_game",
    user="user",
    password="password",
    autocommit=True,
)
# NOTE: cursor variable is set here too
cursor = connection.cursor()

def fetch_airport(cursor) -> List[RowType]:
    cursor.execute(
        "select airport.name, airport.latitude_deg, airport.longitude_deg, country.name, airport.iso_country from airport, country where airport.iso_country = country.iso_country and airport.type = 'large_airport' and country.continent='EU'"
    )
    airports_list = cursor.fetchall()
    # NOTE: debug print whole table
    # print("DEBUG: airport table start")
    # print("DEBUG: airport table end")
    return airports_list
print(fetch_airport(cursor))