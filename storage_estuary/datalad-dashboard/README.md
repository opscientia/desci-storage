# datalad-estuary dashboard
webapp meant to be run locally. Interacts with a nosql server for keeping track of metadata (uploaded?, upload data, CID, size).

## Setup
Make sure you have the API keys for estuary in the required place (replace the field in the `.env` file)

make sure you have `datalad` and `curl` installed.

To run the webapp:
```
npm install
npm start
```

## Flow
1. select a dataset that's not uploaded yet from the list in `/Home`
2. info page for that dataset opens up `/dataset/<dataset-name>`
3. you'll see sequence of commands to be executed. copy-paste one-by-one on the terminal
    datalad get <dataset name>
    cleanup.sh - remove git history, missing files
    curl API call for upload to estuary
