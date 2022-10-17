apt install datalad git

# node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc

nvm install lts/gallium
# check npm and node
npm -v
node -v
# node process manager to run servers as background processes
npm install -g pm2

# install ipfs-car
npm install -g ipfs-car
#########################################
# NOTE: if there are permission issues on the droplet with installing ipfs-car,
# just replace "ipfs-car" with "npx ipfs-car" in the packer scripts
# Only two places to edit - both in filecoin_packer/pack.py
#########################################

git clone https://github.com/opscientia/desci-storage

## mongo api
cd desci-storage/mongo-api
npm install
pm2 start server.js

## datalad dashboard
cd desci-storage/storage_estuary/datalad-dashbord
npm install
pm2 start --name datalad-dashboard npm -- start

## set pm2 to run on reboot
pm2 startup systemd

## setup nginx reverse proxy
# Follow this article "Install NGINX" section
# https://www.digitalocean.com/community/tutorials/deploying-a-node-app-to-digital-ocean

apt install python3-pip
python3 -m pip install python-is-python3 # this symlinks python to python3 for /usr/env
