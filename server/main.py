from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from groq import Groq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://splendid-raindrop-233224.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


GROQ_API_KEY = "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"
groq_client = Groq(api_key=GROQ_API_KEY)

def fetch_data_from_json():
    with open("bookings.json", "r") as f:
        data = json.load(f)
    formatted_data = []
    for booking in data:
        formatted_booking = {
            "id": booking.get("id", "N/A"),
            "name": booking.get("name", "N/A"),
            "length": booking.get("length", "N/A"),
            "img": booking.get("img", "N/A"),
        }
        formatted_data.append(formatted_booking)
    return formatted_data

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    query = body.get("query")

    if not query:
        return {"response": "No query provided."}

    json_data = fetch_data_from_json()
    formatted_data = "\n".join([f"ID: {b['id']}, Name: {b['name']}, Length: {b['length']}, Image: {b['img']}" for b in json_data])

    full_query = f"{query}\n\nHere is the latest booking data:\n{formatted_data}"

    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "user", "content": full_query}
        ],
        model="llama3-8b-8192",
        stream=False,
    )

    groq_response = chat_completion.choices[0].message.content
    return {"response": groq_response}
