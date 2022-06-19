apt install datalad git

# node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc

nvm install lts/gallium

git clone https://github.com/opscientia/desci-storage

npm install -g pm2

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
