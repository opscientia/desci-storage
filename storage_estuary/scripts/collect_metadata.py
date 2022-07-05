#!/usr/bin/env python3

import json
import sys
import subprocess

if len(sys.argv) < 4:
    print(f"Usage; python3 collect_metadata.py <dataset_directory_path> <JSON_output_folder> <dataset_name>")
    sys.exit(1)

DATASET_PATH, JSON_OUTPUT_DIR, DATASET_NAME = sys.argv[1:]

print(f"DATASET_PATH: {DATASET_PATH}\nJSON_OUTPUT_DIR: {JSON_OUTPUT_DIR}\nDATASET_NAME: {DATASET_NAME}")

output = subprocess.Popen(f"cd {DATASET_PATH} && find . -xtype l", stdout=subprocess.PIPE, shell=True)

output_lines = [line_bytes.decode('utf-8') for line_bytes in output.communicate()[0].split()]

for line in output_lines:
    print(line)

# description will be a map - source -> data
# for ex: "datapackage.json" : <info from that file>
#         "README.md": <string copied over from that file>
# ... etc.

description_map = {}

try:
    print(f"Trying to extract datapackage.json {DATASET_NAME}/datapackage.json...")
    with open(f"{DATASET_PATH}/datapackage.json", mode="r") as f:
        description_map["datapackage.json"] = json.load(f)
except:
    print("couldn't open datapackage.json, skipping")

try:
    print(f"Trying to open README.md {DATASET_NAME}/README.md")
    with open(f"{DATASET_NAME}/datapackage.json", mode="r") as f:
        description_map["README.md"] = f.read()
except:
    print("couldn't open README.md in root dir, skipping")

metadata = {
            "name": DATASET_NAME,
            "dataset_size": None,
            "description": description_map,
            "estuary_dealid": None,
            "CID": None,
            "missing_files": output_lines, # format for this? for now a list of file paths rel to root
            "num_pieces": 1, # default for <32GB
            # "piece_CIDs": [array of CIDs in order]

}

metadata_json_object = json.dumps(metadata)

print(f"JSON_OUTPUT_DIR: {JSON_OUTPUT_DIR} | DATASET_NAME: {DATASET_NAME}")
with open(f"{JSON_OUTPUT_DIR}/{DATASET_NAME}.json", mode="w") as f:
    f.write(metadata_json_object)
