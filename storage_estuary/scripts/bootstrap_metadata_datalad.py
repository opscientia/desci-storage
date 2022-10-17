#!/usr/bin/env python3

# 1: get list of datasets
import os
print("running datalad install")
os.system("datalad install ///")
print("done")
with os.popen("ls 'datasets.datalad.org'") as f:
    datasets = f.readlines()

datasets = [d.strip() for d in datasets]
print(datasets)
datasets.remove("datapackage.json")

# 2: initialize and post each one's metadata
import requests
from tqdm import tqdm
import json

API_URL = "http://localhost:3001/initialize"
LOG_FILENAME = "bootstrap_log.txt"

with open("bootstrap_log.txt", mode="a", encoding="utf-8") as f:
    for dataset_name in tqdm(datasets):
        request_data = {
            "name": dataset_name,
            "size": None, # TODO
            "description": None, # TODO
            "specification": None, # TODO
            "license": None, # TODO
        }

        resp = requests.post(API_URL, json=request_data)
        f.write(resp.text)

    f.write("\n") # newline to separate multiple runs in case of failure
