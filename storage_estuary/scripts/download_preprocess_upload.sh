#!/usr/bin/env bash

source "/root/.env" # for ESTUARY_API_KEY

WORKSPACE_DIR="/root/preprocessing/tmp_workspace/"
CARFILES_DIR="/root/preprocessing/carfiles_output/"
JSON_DIR="/root/preprocessing/JSON_outputs/"
PACKER_PATH="/root/preprocessing/packer/packer.py"
PACKER_KEY="/root/preprocessing/keys/certificate.pem"
ROOT_DIR="/root/preprocessing/"
DATASETS_DIR="/root/preprocessing/datasets/"

function download_dataset(){
	echo "Downloading '$1' from datalad..."
	cd $DATASETS_DIR
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

	total=${#MISSING_SYMLINKS}
	echo "Number of missing symlinks: ${total}"
	count=0
	for f in $MISSING_SYMLINKS; do
		count=$(($count+1))
		echo "Missing symlink #$count/$total: $f - removing"
		datalad remove $f
	done

	echo "removing .gitmodules"
	rm -rf ./.gitmodules
	echo "removing datapackage.json as it's causing problems for some reason"
	rm ./datapackage.json
	echo "removing .gitattributes"
	rm ./.gitattributes
	echo "removing index.html"
	rm ./index.html
	cd ../..
	
	echo "check finished"
}

#download_dataset $1

# first pass for metadata - collect missing symlinks
#python3 collect_metadata.py $DATASETS_DIR$1  $JSON_DIR $1

# remove broken symlinks and non-useful files
#preprocess_for_auction $1

#echo "Running packer on $1"

#python3 $PACKER_PATH --pack -s $DATASETS_DIR${1} -t $WORKSPACE_DIR -o $CARFILES_DIR -k $PACKER_KEY

echo "executing estuary request..."

curl -X POST https://shuttle-4.estuary.tech/content/add-car -H "Authorization: Bearer $ESTUARY_API_KEY" -H "Accept: application/json" -T "${CARFILES_DIR}JOB0-CAR0.car"

# echo "\n\nDone with request"

#echo "Cleaning up..."
#rm -rf $DATASETS_DIR/$1
#rm -rf $WORKSPACE_DIR/*
#rm -rf $CARFILES_DIR/*
