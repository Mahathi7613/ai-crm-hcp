from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
import json

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

EMPTY = {
    "hcp_name":"",
    "interaction_type":"",
    "date":"",
    "time":"",
    "attendees":"",
    "topics":"",
    "materials":"",
    "samples":"",
    "sentiment":"",
    "outcomes":"",
    "follow_up":""
}


def normalize_sentiment(data):

    sentiment = (
        str(
            data.get(
                "sentiment",
                ""
            )
        )
        .lower()
        .strip()
    )

    positive = [
        "positive",
        "happy",
        "good",
        "great",
        "excited",
        "interested",
        "enthusiastic",
        "satisfied"
    ]

    neutral = [
        "neutral",
        "okay",
        "normal",
        "average",
        "undecided"
    ]

    negative = [
        "negative",
        "sad",
        "bad",
        "angry",
        "concerned",
        "upset",
        "unhappy",
        "not interested"
    ]

    if any(
        x in sentiment
        for x in positive
    ):

        data["sentiment"] = "Positive"

    elif any(
        x in sentiment
        for x in neutral
    ):

        data["sentiment"] = "Neutral"

    elif any(
        x in sentiment
        for x in negative
    ):

        data["sentiment"] = "Negative"

    return data



def extract_interaction_details(
    user_input
):

    prompt = f"""
You are an AI CRM assistant.

Extract interaction details.

IMPORTANT:

If user corrects:

Sorry the name is Mishra not Rohit

ONLY update corrected fields.

Do NOT invent values.

Return ONLY JSON.

Schema:

{json.dumps(EMPTY,indent=2)}

Interaction:

{user_input}
"""

    try:

        response = llm.invoke(
            prompt
        )

        cleaned = (

            response.content

            .replace(
                "```json",
                ""
            )

            .replace(
                "```",
                ""
            )

            .strip()

        )

        parsed = json.loads(
            cleaned
        )

        result = {}

        for key in EMPTY:

            result[key] = parsed.get(
                key,
                ""
            )

        result = normalize_sentiment(
            result
        )

        return result


    except Exception as e:

        print(
            "Agent Error:",
            e
        )

        return EMPTY.copy()


crm_agent = None