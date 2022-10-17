'''
Assumes the mongo-api server is running onthe same machine at localhost:3001
'''

import sys
import json
import requests

if len(sys.argv) < 2:
    print("Usage: python3 update_metadata_on_db.py <metadata JSON location>")
    sys.exit(1)


with open(sys.argv[1], mode='r') as f:
    metadata_dict = json.load(f)

DB_ENDPOINT = "http://localhost:3001/update_metadata_estuary"

res = requests.post(url=DB_ENDPOINT, json=metadata_dict)
print(f"response:\n{res}\n\n{res.text}\n")


