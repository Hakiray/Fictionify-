from app import RqUID, Authorization
import requests
import json


def get_token():
    url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    payload = 'scope=GIGACHAT_API_PERS'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': RqUID,
        'Authorization': Authorization
    }
    response = requests.post(url=url, headers=headers, data=payload, verify='').json()
    return response["access_token"]


def film_summary(token, film_name):
    url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    payload = json.dumps({
        "model": "GigaChat",
        "messages": [
            {
                "role": "system",
                "content": "Ты — разбираешься в фильмах и аниме и поэтому можешь сделать их краткий пересказ."
            },
            {
                "role": "user",
                "content": film_name
            }
        ],
        "temperature": 1,
        "top_p": 0.1,
        "n": 1,
        "stream": False,
        "max_tokens": 512,
        "repetition_penalty": 1
    })
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    response = requests.post(url=url, headers=headers, data=payload, verify='').json()
    return response["choices"][0]["message"]["content"].replace('\n\n', '\n')
