#!/usr/bin/env bash

source "/root/.env" # for ESTUARY_API_KEY

ROOT_DIR="/mnt/volume_nyc3_01/preprocessing/"
WORKSPACE_DIR="${ROOT_DIR}tmp_workspace/"
CARFILES_DIR="${ROOT_DIR}carfiles_output/"
JSON_DIR="/root/preprocessing/JSON_outputs/"
PACKER_PATH="/root/preprocessing/packer/packer.py"
PACKER_KEY="/root/preprocessing/keys/certificate.pem"
DATASETS_DIR="${ROOT_DIR}datasets/"
SCRIPTS_DIR="/root/preprocessing/"

function download_dataset(){
	echo "Downloading '$1' from datalad..."
	cd $DATASETS_DIR
	# Creating an extra level of nesting - useful in 2 ways
	# 1: packer won't freak out about files in the root directory
	# 2: on retrieving from ipfs - the first directory will be the root with the proper name
	mkdir $1
	cd $1

	datalad install "///$1"
	cd ./$1
	datalad get . -r -J 4
	echo "...Download complete"
	cd $ROOT_DIR
}

function preprocess_for_auction(){
	echo "checking missing files..."
	cd $DATASETS_DIR$1
	MISSING_SYMLINKS=$(find . -xtype l)

	# total=${#MISSING_SYMLINKS}
	# echo "Number of missing symlinks: ${total}"
	count=0
	for f in $MISSING_SYMLINKS; do
		count=$(($count+1))
		echo "Missing symlink #$count/$total: $f - removing"
		datalad remove $f
	done
	echo "${count} locations broken in total\n"

	echo "removing dotfiles as ipfs-car doesn't recognize them currently"
	echo "removing .gitmodules"
	rm -rf ./.gitmodules
	echo "removing .gitattributes"
	rm ./.gitattributes
	echo "removing index.html"
	rm ./index.html
	cd ../..
	
	echo "check finished"
}

download_dataset $1

# first pass for metadata - collect missing symlinks
python3 ${SCRIPTS_DIR}collect_metadata.py $DATASETS_DIR$1  $JSON_DIR $1

#############################
exit

# remove broken symlinks and non-useful files
preprocess_for_auction $1

echo "Running packer on $1"

python3 $PACKER_PATH --pack -s $DATASETS_DIR${1} -t $WORKSPACE_DIR -o $CARFILES_DIR

echo "executing estuary request..."

# TODO: using JOB0-CAR0.car as default for now. Detect number of carfiles and upload accordingly.
curl -X POST https://shuttle-4.estuary.tech/content/add-car -H "Authorization: Bearer $ESTUARY_API_KEY" -H "Accept: application/json" -T "${CARFILES_DIR}JOB0-CAR0.car" > ${JSON_DIR}${1}_request.json
echo "\n\nDone with request"
echo "parsing output json into metadata json"

python3 ${SCRIPTS_DIR}parse_estuary_json.py ${JSON_DIR}${1}_request.json ${JSON_DIR}${1}.json
echo "Parsed metadata file. Updated JSON:"
cat ${JSON_DIR}${1}.json

echo "updating metadata on DB"
# TODO: POST request to mongo API with metadata json
python3 ${SCRIPTS_DIR}update_metadata_on_db.py ${JSON_DIR}${1}.json

# echo "NOT Cleaning up..."
#rm -rf $DATASETS_DIR/$1
# #rm -rf $WORKSPACE_DIR/*
#echo "Deleting carfiles..."
#rm -rf $CARFILES_DIR/*
