from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import mysql.connector
import requests
app = Flask(__name__) # Create an instance for backend
jwt = JWTManager(app)
CORS(app)

class Database:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            print("Successfully connected to the database")
            return True
        except Exception as e:
            print("Error connecting to database:", e)
            return False

    def disconnect(self):
        if self.connection:
            self.connection.close()

    def execute_query(self, query, params=None):
        if not self.connection:
            if not self.connect():
                return None
        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            return cursor.fetchall()
        except Exception as e:
            print("Error executing query:", e)
            return None
        finally:
            if cursor:
                cursor.close()

db = Database("aviation-db.cxaac6iyg7qq.us-east-2.rds.amazonaws.com", "admin", "my123sql", "aviation")

def check_admin(username):
    if db.connect():
        query = "SELECT role FROM login WHERE username = %s"
        result = db.execute_query(query, (username,))
        if result:
            # Assuming the role value of 1 represents an admin
            if result[0][0] == 1:
                return 1
            # Assuming the role value of 2 represents another role
            elif result[0][0] == 2:
                return 2
            else:
                return 0
        else:
            # If no result is returned, the user does not exist
            return 0
    else:
        return 0


# Get the password of a user from the database
def get_password(username):
    if db.connect():
        query = "SELECT password FROM login WHERE username = %s"
        try:
            result = db.execute_query(query, (username,))
            if result:
                # Assuming the password is stored in the first column
                return result[0][0]
            else:
                print("User not found.")
                return None
        except Exception as e:
            print("Error fetching password:", e)
            return None
        finally:
            db.disconnect()
    else:
        return None


# Routes
@app.route('/login/<username>/<password>', methods=['GET'])
def login(username, password):
    if check_admin(username) or 2 == check_admin(username):
        if get_password(username) == password:
            return "200"
        else:
            return jsonify({"msg": "Wrong password"}), 401
    else:
        return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/get_weather/<city>/<state_code>/<country_code>', methods=['GET'])
def get_weather(city,state_code,country_code):
    api_key = '953dc15556e2bec518fe6620a039bf17'
    try:
        url1 = f"http://api.openweathermap.org/geo/1.0/direct?q={city},{state_code},{country_code}&limit=1&appid={api_key}"
        response = requests.get(url1)
        if response.status_code == 200:
            data = response.json()
            latitude = data[0]["lat"]
            longitude = data[0]["lon"]
            url = f"https://api.openweathermap.org/data/3.0/onecall?lat={latitude}&lon={longitude}&appid={api_key}"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                print("Failed to fetch weather data.")
                return None
    except Exception as e:
        print("Error fetching weather data:", e)
        return None

# Get condition from the database based on the tail number
@app.route('/get_condition/<tail_number>', methods=['GET'])
def get_condition(tail_number):
    if db.connect():
        query = "SELECT * FROM plane_performance WHERE tail_number = %s"
        result = db.execute_query(query, (tail_number,))
        if result:
            return jsonify(result)
        else:
            return jsonify({"msg": "Condition not found."}), 404
    else:
        return jsonify({"msg": "Failed to connect to the database."}), 500

def str_to_bool(s):
    return s.lower() in ['true', '1', 't', 'y', 'yes']


@app.route('/insert_condition/<tail_number>/<inspection_complete>/<last_time_inspected>/<plane_registration>', methods=['POST'])
def insert_condition(tail_number, inspection_complete, last_time_inspected, plane_registration):
    if db.connect():
        try:
            query = f"INSERT INTO plane_performance (tail_number, inspection_complete, last_time_inspected, plane_registration) VALUES ({tail_number}, {inspection_complete}, {last_time_inspected}, {plane_registration})"
            db.execute_query(query)
            return jsonify({"msg": "Condition inserted successfully."}), 201
        except Exception as e:
            print("Error inserting condition:", e)
            return jsonify({"msg": "Failed to insert condition."}), 500
        finally:
            db.disconnect()
    else:
        return jsonify({"msg": "Failed to connect to the database."}), 500


@app.route('/calculate_weight_and_balance/<pilot_weight>/<passenger_weights>/<baggage_weight>/<fuel_weight>/<pilot_arm>/<passenger_arm>/<baggage_arm>/<fuel_arm>', methods=['GET']) # POST is being used because we're adding a trip
def calculate_weight_and_balance(pilot_weight :int, passenger_weights:int, baggage_weight:int, fuel_weight:int, pilot_arm:int, passenger_arm:int, baggage_arm:int, fuel_arm:int):
    pilot_weight = int(pilot_weight)
    passenger_weights = int(passenger_weights)
    baggage_weight = int(baggage_weight)
    fuel_weight = int(fuel_weight)
    pilot_arm = int(pilot_arm)
    passenger_arm = int(passenger_arm)
    baggage_arm = int(baggage_arm)
    fuel_arm = int(fuel_arm)
    total_weight = pilot_weight + passenger_weights + baggage_weight + fuel_weight
    total_moment = (pilot_weight * pilot_arm) + ( passenger_weights * passenger_arm ) + (baggage_weight * baggage_arm) + (fuel_weight * fuel_arm)
    cg = total_moment / total_weight
    return {"total_moment": total_moment, "cg": cg}


if __name__ == '__main__':
    app.run(debug=True)