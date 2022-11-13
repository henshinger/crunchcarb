import openai
import functions_framework
import os 
import requests 
import json
from flask import escape
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)  # for exponential backoff

openai.api_key = os.environ.get('OPENAI_API_KEY')

def summarize(text, action):
    text_arr = text.split(" ")
    print(len(text_arr))
    if len(text_arr) <= 500:        
        response = completion_with_backoff(
            model="text-davinci-002",
            prompt=get_prompt(action, text),
            temperature=0.7,
            max_tokens=1000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return response.choices[0].text
    else:
        print("chunking will happen")
        res = []
        chunks = [
            text_arr[i : i + 500]
            for i in range(0, len(text_arr), 450)
        ]
        chunks = [" ".join(chunk) for chunk in chunks]
        for chunk in chunks:
            response = completion_with_backoff(
                model="text-davinci-002",
                prompt=get_prompt(action, chunk),
                temperature=0.7,
                max_tokens=1000,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            res.append(response.choices[0].text)
        return "\n".join(res)

def get_prompt(action, text):
    prompts = {
        "summarize": f"Summarize the following text:\n\n{text}",
        "rephrase_public": f"Rephrase the following text to be relevant for the public:\n\n{text}",
        "rephrase_business": f"Rephrase the following text to be relevant for business leaders:\n\n{text}",
        "rephrase_policymakers": f"Rephrase the following text to be relevant for policy makers:\n\n{text}",
        "create_email": f"Create an email based on the following text:\n\n{text}",
        "create_policy": f"Create a policy based on the following text:\n\n{text}",
        "create_press_release": f"Create a press release based on the following text:\n\n{text}",
        "create_petition": f"Create a petition letter based on the following text:\n\n{text}",
        "create_tweet": f"Create a tweet based on the following text:\n\n{text}" 
    }
    return prompts.get(action, prompts.get("summarize"))
    
@functions_framework.http
def summarize_http(request):
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    # request_args = request.args
    print(request_json)
    if request_json and 'text' in request_json:
        text = request_json['text']
        action = request_json.get("action", "summarize")
        answer = summarize(text, action)
    else:
        return "input in incorrect format/ unrecognized", 500
    return json.dumps({"summary": answer}), 200, headers

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(5))
def completion_with_backoff(**kwargs):
    return openai.Completion.create(**kwargs)