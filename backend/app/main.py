from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Interaction

from app.agent import (
    extract_interaction_details
)

Base.metadata.create_all(
    bind=engine
)

app = FastAPI()

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


@app.get("/")
def home():

    return {

        "message":

        "AI CRM Running"

    }


@app.post("/chat")
def chat(payload: dict):

    user_message = payload.get(
        "message",
        ""
    )

    current_form = payload.get(
        "current_form",
        {}
    )

    extracted = extract_interaction_details(
        user_message
    )

    fields = [

        "hcp_name",

        "interaction_type",

        "date",

        "time",

        "attendees",

        "topics",

        "materials",

        "samples",

        "sentiment",

        "outcomes",

        "follow_up"

    ]

    merged = {}

    for field in fields:

        new_value = extracted.get(
            field,
            ""
        )

        old_value = current_form.get(
            field,
            ""
        )

        merged[field] = (

            new_value

            if str(
                new_value
            ).strip()

            else old_value

        )

    return {

        "success":

        True,

        "message":

        "✓ Interaction updated successfully",

        "form_data":

        merged

    }


@app.post("/ai-log-interaction")
def ai_log_interaction():

    return {

        "message":

        "Use chat endpoint"

    }