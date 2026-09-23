import os
import json

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set")

client = Groq(api_key=GROQ_API_KEY)


SYSTEM_PROMPT = """You are an issue triage assistant. Given a raw bug report, error log, or customer message, extract a structured software issue.

Only treat the input as an issue if it describes a bug, error, failure, unexpected behavior, broken functionality, or a customer-reported problem.

If the input is NOT an issue, return a neutral result with:
- title: "No issue reported"
- service: "General"
- severity: "P4"
- reproduction_steps: ""
- ai_summary: ""
- ai_severity_reason: ""
- ai_confidence: 0.0

For a valid issue, infer the fields conservatively from the information provided. Do not invent reproduction steps or specific technical details that are not supported by the input.

Return ONLY valid JSON in this exact shape:

{
  "title": "short, clear issue title",
  "service": "best-guess service/component name",
  "severity": "P1" | "P2" | "P3" | "P4",
  "reproduction_steps": "steps if mentioned, one per line, or empty string",
  "ai_summary": "Concise summary of the issue",
  "ai_severity_reason": "Concise explanation of why the issue was assigned this severity",
  "ai_confidence": 0.0
}
"""


CHAT_SYSTEM_PROMPT = """You are Sentinel AI Assistant.

Sentinel is a software issue and service management platform.

Help the user with:
- software issues
- debugging
- issue analysis
- severity and prioritization
- software development
- APIs
- backend development
- general technical questions

Be concise, practical, and technically accurate.

Do not claim that you performed an action in Sentinel unless the system actually provided you with a tool to perform that action.
"""


def extract_issue_from_text(raw_text: str) -> dict:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": raw_text},
        ],
        response_format={"type": "json_object"},
    )

    result = json.loads(response.choices[0].message.content)

    confidence = result.get("ai_confidence")

    try:
        confidence = float(confidence)
    except (TypeError, ValueError):
        confidence = 0.0

    confidence = max(0.0, min(1.0, confidence))

    result["ai_confidence"] = confidence

    if confidence >= 0.80:
        result["ai_confidence_level"] = "High"
    elif confidence >= 0.60:
        result["ai_confidence_level"] = "Moderate"
    else:
        result["ai_confidence_level"] = "Low"

    return result


def stream_chat(messages):
    groq_messages = [
        {
            "role": "system",
            "content": CHAT_SYSTEM_PROMPT
        }
    ]

    for message in messages:
        groq_messages.append(
            {
                "role": message["role"],
                "content": message["content"]
            }
        )

    return client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=groq_messages,
        temperature=0.3,
        stream=True
    )