from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

# Connexion à la base de données MySQL
connection = mysql.connector.connect(
    database="ynovmsql",
    user="ynovuser",
    password="ynovpwd",
    port=3306,
    host="mysql"
)

# Route pour ajouter un utilisateur
@app.post('/users')
async def add_user(user_data: dict = Body(...)):
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO User (birthDate, email, name, surname, city, postalCode) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (user_data['birthDate'], user_data['email'], user_data['name'], user_data['surname'], user_data['city'], user_data['postalCode']))
        connection.commit()
        cursor.close()
        return {"message": "User added successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route pour obtenir tous les utilisateurs
@app.get('/users')
async def get_users():
    try:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT * FROM User"
        cursor.execute(sql)
        users = cursor.fetchall()
        cursor.close()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route pour supprimer un utilisateur
@app.delete('/users/{user_id}')
async def delete_user(user_id: int, body: dict = Body(...)):
    try:
        if body['delete_pswd'] != 'delete':
            raise HTTPException(status_code=401, detail="Unauthorized")
        cursor = connection.cursor()
        sql = "DELETE FROM User WHERE id = %s"
        print("USER ID : %s", user_id)
        cursor.execute(sql, (user_id,))
        connection.commit()
        cursor.close()
        return "User deleted successfully"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
