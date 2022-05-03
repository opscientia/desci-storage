"""
JSON entry for each dataset

Q: is there a way to reuse deals from Textile broker inside estuary?
Meaning -> don"t re-deal for datasets already in filecoin.
CON: Will probably be too much overhead / overengineering. Focus on MVP
"""

import json, sys

LOGFILE = "/data/logs/datalad_logs.json" # default for now. Use .env variables ideally

name, size_kb, num_replications, deal_id, piece_size, piece_cid, payload_cid = sys.argv[1:]

try:
    with open(LOGFILE, "r") as f:
        json_data = json.load(f)
        new_id = sorted([row["dataset_id"] for row in json_data])[-1]
except Exception as e:
    json_data = []
    new_id = 0

log_object = {
    "dataset_id": new_id, # <for uniqueness, will probably use this in Coral Metadata later on>
    "dataset_size": size_kb, # size of raw dataset in KB
    "description": "None",
    "specification": "None", # BIDS, NWB, DICOM, etc.
    "license": "None", # GPL, MIT, etc.
    "remotes": [], # list of git-annex remotes, leaving empty for now. can retro-populate this from datalad metadata
    "web3_archive_info": {
        "filecoin": {
            "archived": True, #TODO: write check_auction.sh script to keep updating archived and status
            "status": "Auctioning", # TODO
            "num_replications": num_replications, # replication factor
            "method": "Textile Broker",
            "num_pieces": 1, # default 1 for datasets < 32GB, when we begin chunking for larger data, this will change
            "deal_info": [
                {
                    "piece_index": 1, # for larger datasets, we'll have multiple pieces each <=32GB
                    'deal_id': deal_id, # Deal ID for tracking broker deals - this lets us check deal status
                    "piece_cid": piece_cid,
                    "piece_size": piece_size,
                    "payload_cid": payload_cid,
                },
            ]
        },
        "IPFS": {
            "CID": None,
            "times_pinned": 0,
            "IPFS_Metadata": {},
        }
    },
#    dataset_hash: <some sort of hash digest of entire dataset - for verifiability,
}

json_data.append(log_object)

try:
    with open(LOGFILE, 'w') as f:
        json.dump(json_data, f)
except Exception as e:
    print(f"Error writing log to JSON db:\n{e}")
