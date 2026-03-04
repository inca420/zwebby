import json
import time
import requests

API_KEY = "sk-pZQtTyQnsnHHQ2ZRQb04ZN3ac7nAF"
BASE_URL = "https://api.apifree.ai"

def call_apifree():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "bytedance/seedream-4.5",
        "prompt": "a beautiful white sand beach"
    }

    print("Submitting request...")
    resp = requests.post(f"{BASE_URL}/v1/image/submit", headers=headers, json=payload)
    data = resp.json()
    print("Submit Response:", data)
    request_id = data["resp_data"]["request_id"]
    print(f"Task submitted. Request ID: {request_id}")

    # 2. Poll for Result
    while True:
        time.sleep(2) # Wait 2 seconds between checks
        check_url = f"{BASE_URL}/v1/image/{request_id}/result"
        print(f"Checking status at {check_url}...")
        check_resp = requests.get(check_url, headers=headers)
        print(f"Check HTTP Status: {check_resp.status_code}")
        check_data = check_resp.json()
        print(f"Check JSON Response: {check_data}")
        break

if __name__ == "__main__":
    call_apifree()
