import pymongo
import json

# MongoDB Atlas connection string
connection_string = "mongodb+srv://haris22aim:GNBahUYI7gLggXFQ@cluster0.8hygc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB
client = pymongo.MongoClient(connection_string)
db = client["test"]
collection = db["movies"]

# Fetch all documents from the collection
documents = list(collection.find({}))

# Save documents to a JSON file
with open("bookings.json", "w") as file:
    json.dump(documents, file, default=str, indent=4)

print("Data exported to bookings.json")