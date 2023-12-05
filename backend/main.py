import mysql.connector
from flask import Flask
from flask_cors import CORS
import random


try:
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

except mysql.connector.Error as err:
    print(f"Error: {err}")
    # Handle the error (database not live or doesn't exist)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class Gamestate:
    def __init__(self, username, CountriesVisited, co2_budget=10_000, co2_consumed=0, money=0, AirportCountry="FI", Location="EFHK"):
        self.co2_budget = co2_budget
        self.co2_consumed = co2_consumed
        self.money = money
        self.AirportCountry = AirportCountry
        self.Location = Location
        self.CountriesVisited = CountriesVisited
        self.username = username

    def get_airport_coordinates(self,icao):
        sql = "SELECT latitude_deg, longitude_deg FROM airport WHERE ident = %s"
        cursor = connection.cursor()
        cursor.execute(sql, (icao,))
        result = cursor.fetchone()
        if result:
            return result
        else:
            print(f"Airport with ICAO code {icao} not found in the database.")
            return None

    def calculate_distance_between_airports(self, target):
        from geopy.distance import geodesic

        coords1 = self.get_airport_coordinates(self.Location)
        coords2 = self.get_airport_coordinates(target)
        if coords1 and coords2:
            # Create geodesic objects using the coordinates
            location_coords = (coords1[0], coords1[1])
            target_coords = (coords2[0], coords2[1])
            distance = geodesic(location_coords, target_coords).kilometers
            return distance
        else:
            return None


def fetch_countries():
    sql = "SELECT name FROM country where continent = 'EU'"
    cursor.execute(sql)
    countrylist = []
    countries = cursor.fetchall()
    for country in countries:
        countrylist.append(country)
    return countrylist


AllCountries = fetch_countries()
game = Gamestate(username, [])
