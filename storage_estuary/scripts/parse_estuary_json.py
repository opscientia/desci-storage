import json
import sys

if len(sys.argv) < 3:
    print("Usage: python3 parse_estuary_json.py <JSON file containint estuary output> <metadata JSON file to modity>")
    sys.exit(1)

# 1: read json output from estuary curl request
with open(sys.argv[1], mode="r") as f:
    estuary_dict = json.loads(f.read())

if "cid" not in estuary_dict.keys():
    print("Estuary request failed, curl output dict:")
    print(estuary_dict)
    sys.exit(1)
else:
    print(f"CID: {estuary_dict['cid']} | Estuary ID: {estuary_dict['estuaryId']}")

# 2: add estuary deal information and CID(s) to pre-filled metadata json
with open(sys.argv[2], mode='r') as f:
    metadata_dict = json.loads(f.read())

metadata_dict['CID'] = estuary_dict['cid']
metadata_dict['estuary_dealid'] = estuary_dict['estuaryId']
metadata_dict['archived'] = True

# 3: modify existing metadata file with updated info
with open(sys.argv[2], mode='w') as f:
    f.write(json.dumps(metadata_dict))
