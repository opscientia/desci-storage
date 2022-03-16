##### Establish VM / Remote Host & Login

instructions for setting up remote host - [https://www.google.com/url?q=https://www.digitalocean.com/community/tutorials/building-for-production-web-applications-overview&sa=D&source=editors&ust=1631901520175000&usg=AOvVaw0Cn2Im_zecbLoV7TGr4F8U](https://www.google.com/url?q=https://www.digitalocean.com/community/tutorials/building-for-production-web-applications-overview&sa=D&source=editors&ust=1631901520175000&usg=AOvVaw0Cn2Im_zecbLoV7TGr4F8U)


##### Install go

Make sure you install go1.16 - powergate is built to target that version. 1.17 will throw errors.

Set the environment variables - $GOPATH, etc. as given in the powergate install directions

Once SSH-ed into the VM:



1. Download Go


```
wget https://golang.org/dl/go1.16.8.linux-amd64.tar.gz
```



2. Replace local install with extracted version


```
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.16.8.linux-amd64.tar.gz
```



3. Updates path in environment


```
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc

source ~/.bashrc
```



4. Check if go is installed properly


```
go version
```



##### Install IPFS

The normal way - download the tar, copy over to /usr/local/bin etc. (here I’m using the update-ipfs util)



5. Set default location for ipfs datastore


```
echo 'export IPFS_PATH=~/.ipfs' >> ~/.bashrc

source ~/.bashrc
```



6. Download IPFS-update tarball, unpack, install


```
wget https://dist.ipfs.io/ipfs-update/v1.5.2/ipfs-update_v1.5.2_linux-amd64.tar.gz

tar xvfz ipfs-update_v1.5.2_linux-amd64.tar.gz

cd ipfs-update

sudo ./install.sh

ipfs-update install latest
```



7. Make sure to init ipfs with the server profile


```
ipfs init --profile server
```



##### Install Powergate

Steps: [https://github.com/textileio/powergate](https://github.com/textileio/powergate)



8. Install make if not already present


```
sudo apt install make
```



9. Environment variables


```
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc

echo 'export GOPATH=$(go env GOPATH)' >> ~/.bashrc

source ~/.bashrc
```



10. Download and install powergate cli


```
git clone https://github.com/textileio/powergate

cd powergate

make install-pow
```



##### To start ipfs

We can run ipfs as a service via systemctl so the daemon runs always-on as a background service, as explained here: [https://blog.stacktical.com/ipfs/gateway/dapp/2019/09/21/ipfs-server-google-cloud-platform.html](https://blog.stacktical.com/ipfs/gateway/dapp/2019/09/21/ipfs-server-google-cloud-platform.html)

(TODO: try and test above method)



11. Temporarily, I ran the daemon in the background with the bg command:


```
ipfs daemon
Press Ctrl+Z
bg
```


This will run the ipfs daemon as a background process, but wont restart on reboot.


##### Download one of datalad’s open datasets

(was trying to use this as a test)


```
datalad install ///nidm
```

^ this is around 2.7G, ideal size for testing

Note: once datasets are installed recurisvely you can use the `datalad ls -r -L` command to see how big they are before you retrieve their files


##### Generate sample random data for testing query


```
head -c 2100M </dev/random >test2_1G.txt
```



##### Create the CAR file and pin to IPFS

[https://docs.textile.io/powergate/offline/](https://docs.textile.io/powergate/offline/)

(NOTE: using the --json --aggregate flags doesn’t give a progress bar - need patience :). A 2.1GB file took around 3 mins for creating the DAG, serializing into a CAR file takes another 5-6 mins)



12. Convert dataset to CAR file (serialized IPLD DAG) using powergate cli

for single files
```
pow offline prepare test2_1G.txt sample_dataset.car
```


for directories/single files both. This is a more generalized method

```
pow offline prepare --json --aggregate test2_1G.txt sample_dataset.car
```



13. Add to ipfs


```
ipfs add sample_dataset.car
```


Make note of the info returned - CID, piece size, etc. This will be used to create the auction query in the next section.


##### Create the query

From [https://textile.notion.site/Haggle-client-onboarding-b34f542fd5444ee08f1e69386307f26a](https://textile.notion.site/Haggle-client-onboarding-b34f542fd5444ee08f1e69386307f26a)



14. Download broker utils repo, construct query


```
git clone https://github.com/textileio/broker-utils
cd broker-utils
```



15. Make auction script executable


```
chmod +x auction-data.sh
```



16. Construct bash query based on the above notion:


```
./auction-data.sh https://broker.staging.textile.dev dRyrUn <url-of-your-car-file> <payload-cid> <piece-cid> <piece-size-bytes> <rep-factor (use 2)>
```



#### Some observations

Test out pinning with small txt files for better discoverability of your node first. Bootstrapping takes some time initially. For example, if you run the daemon both locally on your computer and on the hosted vm, first add a small txt file on your local node, run ipfs get &lt;cid> for that file. Then proceed with testing with the larger .car file.

Another observation: smaller files get discovered quickly, larger files took a lot of time. I spun up IPFS nodes on two GCP VM instances - one located in us-east, the other in india (delhi). A &lt;100MB txt file took around 10-15 sec to be found. For the larger 2GB car file, it didn’t get discovered for around 15 mins, so I logged out of the VM. Then around 1.5 hours later I tried again and this time it worked. TODO: research discoverability on IPFS, and how to improve. Maybe chunking is necessary for speed.
