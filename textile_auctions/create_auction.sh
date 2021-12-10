num_args=$#
if [ $num_args -lt 2 ]; then
	echo "Not enough arguments"
	echo "Usage: ${0} <dataset name> <api key>"
	exit 1
fi

DATASET_NAME=$1
NGINX_DIR="/data/carfiles/" # where to put the carfile for serving
API_KEY=$2 # pass this in as second arg, might be convenient to have this as an env variable
REP_FACTOR="5" # recommended replication factor is 5
BROKER_URL="https://broker.staging.textile.dev/"
SERVER_IP="167.71.215.71" # the IP of this NGINX server droplet, this might change later. We can have a subdomain pointing to this in the future.

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

function check_availability(){
	# assumes datalad get has been run already
	cd datasets/$1
	MISSING_SYMLINKS=$(find . -xtype l)

	total=${#MISSING_SYMLINKS}
	echo "Number of missing symlinks: ${total}"

	count=0
	for f in $MISSING_SYMLINKS; do
		count=$(($count+1))
		echo "Missing symlink #$count/$total: $f - removing"
		datalad remove $f
	done
}

function prepare_carfile(){
	cd datasets/
	echo "Creating carfile"
	{
		pow offline prepare --json --aggregate "${1}/" "${1}.car"
	} > "${1}.log" 2>&1
	echo "carfile created"
	echo ""
	cd ..
}
#move carfile to  correct location so nginx can serve it
function move_carfile(){
	cd datasets/
	mv "$1.car" $2
	echo "NGINX directory contents:"
	ls $2
	cd ..
}

download_dataset $DATASET_NAME
check_availability $DATASET_NAME
prepare_carfile $DATASET_NAME
move_carfile $DATASET_NAME $NGINX_DIR

# extracting relevant info from json output using a python script (piece_cid, piece_size, etc.)
PARSED=`python3 parse_json.py datasets/${DATASET_NAME}.log`
IFS=" "
{
	read -a arr <<< "$PARSED"
}

./auction-data.sh $BROKER_URL $API_KEY http://${SERVER_IP}/carfiles/${DATASET_NAME}.car ${arr[0]} ${arr[1]} ${arr[2]} $REP_FACTOR

echo "done..."
