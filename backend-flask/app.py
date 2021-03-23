import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

# from models import User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.sqlite'
app.config['SECRET_KEY'] = "random string"

db = SQLAlchemy(app)

class User(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   public_id = db.Column(db.String(50), unique=True)
   name = db.Column(db.String(50))
   password = db.Column(db.String(80))
   admin = db.Column(db.Boolean)

@app.route("/user", methods=['GET'])
def get_all_users():
   users = User.query.all()
   output = []

   for user in users:
      user_data = {}
      user_data['public_id'] = user.public_id
      user_data['name'] = user.name
      user_data['password'] = user.password
      user_data['admin'] = user.admin
      output.append(user_data)

   return jsonify({'users': output})

@app.route("/user", methods=['POST'])
def create_user():
   data = request.get_json()
   hashed_password = generate_password_hash(data['password'], method="sha256")
   new_user = User(public_id=str(uuid.uuid4()), name=data['name'], password=hashed_password, admin=False)
   db.session.add(new_user)
   db.session.commit()

   return jsonify({'message': 'New User Created'})

if __name__ == '__main__':
   app.run(debug = True)