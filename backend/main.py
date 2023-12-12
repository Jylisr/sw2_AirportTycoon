import mysql.connector
from flask import Flask, request
from flask_cors import CORS
import random
import database
#External dependencies: mysql.connector, flask, flask_cors

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
database.modify_database(cursor)
player_table = database.fetch_players(cursor)
playertable={}
for i in player_table:
    playertable[player_table[i][0]] = player_table[i]
    # The 0 in [player_table[i][0]] is = id
airports = database.fetch_airport(cursor)

def fetch_countries():
    sql = "SELECT name FROM country where continent = 'EU'"
    cursor.execute(sql)
    countrylist = []
    countries = cursor.fetchall()
    for country in countries:
        countrylist.append(country)
    return countrylist

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'




class Airport:

    def __init__(self, AirportCountry, Location):
        self.AirportCountry = AirportCountry
        self.Location = Location

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

    def calculate_distance_between_airports(self, Location, target):
        from geopy.distance import geodesic

        coords1 = self.get_airport_coordinates(Location)
        coords2 = self.get_airport_coordinates(target)
        if coords1 and coords2:
            # Create geodesic objects using the coordinates
            location_coords = (coords1[0], coords1[1])
            target_coords = (coords2[0], coords2[1])
            distance = geodesic(location_coords, target_coords).kilometers
            return distance
        else:
            return None

class Gamestate(Airport):
    def __init__(self, username, CountriesVisited, EveryCountry, ShopsList, status = "active", co2_budget=10_000, co2_consumed=0, money=10_000, AirportCountry="FI", Location="EFHK"):
        self.co2_budget = co2_budget
        self.co2_consumed = co2_consumed
        self.money = money
        self.CountriesVisited = CountriesVisited
        self.username = username
        self.EveryCountry = EveryCountry
        self.status = status
        self.ShopsList = ShopsList
        super().__init__(AirportCountry, Location)


    def fly(self,target):
        distance = super().calculate_distance_between_airports(target)
        CO2_KG_USED_PER_KM_FLOWN = 0.133
        co2_used = distance * CO2_KG_USED_PER_KM_FLOWN
        self.co2_consumed = self.co2_consumed + co2_used
        self.co2_budget = self.co2_budget - co2_used
        self.Location = target
        return co2_used


    def name_check(name, some_list) -> bool:
        for i in some_list:
            if i[4] == name:
                return False
        return True
    def fetch_players(cursor):
        cursor.execute("select * from game;")
        highscore_list = cursor.fetchall()
        # NOTE: debug print whole table
        # print("DEBUG: game table start")
        # print(highscore_list)
        # print("DEBUG: game table end")
        return highscore_list


    def introduction_procedures(self):
        query = f"insert into game(screen_name, co2_budget,co2_consumed) values ('{self.username}',{self.co2_budget},0);"
        cursor.execute(query)
        return {self.username,self.co2_budget, self.co2_consumed,self.money}

    def generate_random_shop(self):
        num_shops = random.randint(1, 7)
        shop_names = [
            "Duty-Free Shop",
            "Coffee House",
            "Electronics Store",
            "Bookstore",
            "Gift Shop",
            "Fashion Boutique",
            "Restaurant",
        ]
        list_of_shops = []
        for _ in range(num_shops):
            name = random.choice(shop_names)
            price = random.randint(1000, 8000)
            revenue_per_month = random.randint(1000, 5000)
            list_of_shops.append([name, price, revenue_per_month])
        return list_of_shops


AllCountries = fetch_countries()
game = Gamestate("", [], AllCountries,[])


#Starts a new game which means it does all the start up procedures
#and takes player's name as an input
# http://127.0.0.1:5000/newgame?name=?
@app.route('/newgame')
def newgame():
    args = request.args
    name = args.get("name")
    game.username=name
    player_info = game.introduction_procedures()
    return player_info

@app.route('/highscore')
def highscore():
    json_data=playertable
    return json_data

#Whenever a request to fly is sent a random set of 10 airports is returned
@app.route('/flyrequest')
def flyrequest():
    json_data = {}
    i = 0
    cursor.execute(
        "select airport.name, airport.latitude_deg, airport.longitude_deg, country.name from airport, country where airport.iso_country = country.iso_country and airport.iso_country={game.Location};"
    )
    current_airport = cursor.fetchall()
    for airport in current_airport:
        data = {'name': airport[1], 'latitude': airport[2], 'longitude': airport[3], 'country': airport[4], 'active': True}
        json_data['Airport' + str(i)] = data
        i += 1
    for airport in airports:
        if airport[0] != game.Location:
            data = {'name': airport[1], 'latitude': airport[2], 'longitude': airport[3], 'country': airport[4], 'active': False}
            json_data['Airport'+str(i)] = data
            i+=1
    return json_data

#Everything to execute flying and returns co2 details and new location
# http://127.0.0.1:5000/flyto?icao=?
@app.route('/flyto')
def flyto():
    args = request.args
    icao_code = args.get("icao")
    json_data={}
    json_data["CO2 consumed"] = game.fly(icao_code)
    json_data["CO2 Budget"] = game.co2_budget
    json_data["CO2 Consumed"] = game.co2_consumed
    json_data["Location"] = game.Location
    return json_data

@app.route('/shoprequest')
def shoprequest():
    json_data = {}
    list_of_shops = game.generate_random_shop()
    for i in len(list_of_shops):
        json_data["Shop"+str(i)] = list_of_shops[i]
    return json_data

#executes the buying operations and returns the player's balance
# http://127.0.0.1:5000/playerbought?shoptype=?&shoprevenue&shopcost=?
@app.route('/playerbought')
def playerbought():
    args = request.args
    shoptype = args.get("shoptype")
    shoprevenue = args.get("shoprevenue")
    shopcost = args.get("shopcost")
    game.ShopsList.append([shoptype, int(shoprevenue)])
    game.money = game.money - int(shopcost)
    json_data = {"Player Money Balance" : game.money}
    return json_data


# Start new game
# http://127.0.0.1:5000/newgame?pname=


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)