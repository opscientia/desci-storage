# this assumes there's a "datasets" directory in the same pwd where script is run
# it will download datalad dataset in the datasets directory, create a carfile and a log file. then the logfile will be parsed to extract relevant auction info, the carfile will be moved to the relevant directory for NGINX to serve it, and the auction request will be created
# run the following
# 	./create_auction.sh <dataset_name> <API_KEY>
# for ex:
# 	./create_auction cifar iNvAlIdKeY


DATASET_NAME=$1 # pass in datalad dataset name. for ex "cifar"
NGINX_DIR="/data/carfiles/" # where to put the carfile for serving
API_KEY=$2 # pass this in as second arg, not writing here :P
REP_FACTOR="5" # recommended replication factor is 5
BROKER_URL="https://broker.staging.textile.dev/"
SERVER_IP="" #NOTE: Populate this while using ------ 

cd datasets

datalad install -r "///${DATASET_NAME}"
cd "${DATASET_NAME}"
echo "Installed dataset - ${DATASET_NAME}"
echo "Size:"
datalad ls -r -L
echo ""
echo "Downloading dataset..."
datalad get . -r

cd ..
echo "Creating carfile"
{
	pow offline prepare --json --aggregate "${DATASET_NAME}/" "${DATASET_NAME}.car"
} > "${DATASET_NAME}.log" 2>&1
echo "carfile created"
echo ""

#move carfile to  correct location so nginx can serve it
mv "${DATASET_NAME}.car" $NGINX_DIR
echo "NGINX directory contents:"
ls $NGINX_DIR

cd ..

# extracting relevant info from json output using a python script (piece_cid, piece_size, etc.)
PARSED=`python3 parse_json.py datasets/${DATASET_NAME}.log`
IFS=" "
{
	read -a arr <<< "$PARSED"
}

./auction-data.sh $BROKER_URL $API_KEY http://${SERVER_IP}/carfiles/${DATASET_NAME}.car ${arr[0]} ${arr[1]} ${arr[2]} $REP_FACTOR

echo "done..."
