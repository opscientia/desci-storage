#!/usr/bin/env python3

import json
import sys
import subprocess

if len(sys.argv) < 4:
    print(f"Usage; python3 collect_metadata.py <dataset_directory_path> <JSON_output_folder> <dataset_name>")
    sys.exit(1)

DATASET_PATH, JSON_OUTPUT_DIR, DATASET_NAME = sys.argv[1:]

output = subprocess.Popen(f"cd {DATASET_PATH} && find . -xtype l", stdout=subprocess.PIPE, shell=True)

output_lines = [line_bytes.decode('utf-8') for line_bytes in output.communicate()[0].split()]

for line in output_lines:
    print(line)

metadata = {
            "name": DATASET_NAME,
            "dataset_size": None,
            "description": None,
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
