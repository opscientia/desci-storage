#!/usr/bin/env bash

### outline
# 0. set status to BUSY
# 1. download specified dataset using datalad commands
# 2. preprocessing - detect missing files and make a list of filepaths
# 3. create the metadata JSON - schema as defined in the mongo-api repo
# 4. estuary request - curl + make note of response
#         - if FAILURE, add to log, don't update metadata
#         - if SUCCESS, update metadata AND add log
# 5. set status to IDLE


num_args=$#
if [ $num_args -lt 1 ]; then
	echo "Not enough arguments"
	echo "Usage: ${0} <dataset name>"
	exit 1
fi

function download_dataset(){
	cd datasets
	datalad install -r "///${1}"
	cd "${1}"
	echo "Installed dataset - ${1}"
	echo "Size:"
	datalad ls -r -L
	echo ""
	echo "Downloading dataset..."
	datalad get . -r
	cd ../..
}

function preprocess_for_auction(){
	# assumes datalad get has been run already
	echo "checking missing files..."
	cd "datasets/$1"
	MISSING_SYMLINKS=$(find . -xtype l)

	total=${#MISSING_SYMLINKS}
	echo "Number of missing symlinks: ${total}"

	count=0
	for f in $MISSING_SYMLINKS; do
		count=$(($count+1))
		echo "Missing symlink #$count/$total: $f - removing"
		datalad remove $f
	done

	cd ../..
	echo "check finished"
}


### Notes
# keep the .git files for now
# This onboards from datalad -> filecoin. I'll later add the reverse -
# adding the estuary index as another remote into datalad
# (for the files that are present at least)
