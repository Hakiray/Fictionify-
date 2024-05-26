import requests
import json


def get_token():
    url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    payload = 'scope=GIGACHAT_API_PERS'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': 'a8e14413-16ec-4d1c-9a9a-37e80294000c',
        'Authorization': 'Basic NjFiZGViNmYtNjg5Yy00OTI2LWE5NWItNTU4Mjc5YzQ3YmRlOmE4ZTE0NDEzLTE2ZWMtNGQxYy05YTlhLTM3ZTgwMjk0MDAwYw=='
    }
    response = requests.request("POST", url, headers=headers, data=payload, verify=False).json()
    return response['access_token']