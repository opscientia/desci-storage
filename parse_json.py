#!/use/bin/env python3

import json, sys

inp = sys.argv[1]
with open(inp) as f:
    data = json.load(f)

out_str = f"{data['payload_cid']} {data['piece_size']} {data['piece_cid']}"
print(out_str)
