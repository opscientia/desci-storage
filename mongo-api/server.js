// get packages
require('dotenv').config();

const express = require('express');
const mongodb = require('mongodb');
const { exec } = require('child_process');
const cors = require('cors');
// const fetch = require('node-fetch');

// config the app
const app = express();
const port = process.env.PORT || 3001;
const MongoClient = mongodb.MongoClient;
// const date = new Date();

app.use(express.json());
app.use(cors());

// connect to mongo database
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    // use previous connection if cache available
    if (cachedDb) return cachedDb;

    // otherwise create new connection to db
    const client = await MongoClient.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
        tlsCAFile: "./ca-certificate.crt", // don't add this file to git XD
    });

    // give a name to db
    const db = client.db('datalad_archival');

    cachedClient = client;
    cachedDb = db;

    return db;
}

// create routes
/// home
app.get('/', (req, res) => {
    res.send("datalad pipeline controller server");
});

/// execute shell command
// app.post("/exec", async (req, res) => {
//     console.log("executing ls -la on terminal");
//
//     exec("ls -lha", (error, stdout, stderr) => {
//         if(error) {
//             res.json({"error": `${error.message}`});
//             return;
//         }
//
//         if(stderr) {
//             res.json({"stderr": `${stderr}`});
//             return;
//         }
//
//         res.json({"stdout": `${stdout}`});
//     });
// });


// TODO: Get this to work somehow, right now fetch errors out as it is ESM only
// function get_working_shuttles() {
//     fetch('https://api.estuary.tech/viewer',{
//             method: "GET",
//             headers: {
//               Authorization: process.env.ESTUARY_API_KEY,
//             }
//       })
//       .then(data => data.json())
//       .then(res =>  res.settings.uploadEndpoints);
// };

/// execute shell command
app.post("/initiate_deal", async (req, res) => {
    const dataset_name = req.body.dataset_name
    console.log("Initiating deal for dataset: ", dataset_name);

    exec(`bash scripts/initiate_deal.sh ${dataset_name}`, (error, stdout, stderr) => {
        var result_json = {};
        if(error) {
            result_json["error"] = `${error.message}`;
        }

        if(stderr) {
            result_json["stderr"] = `${stderr}`;
        }

        result_json["stdout"] = `${stdout}`;
        res.json(result_json);
    });
});

/// update

/// delete


/// status
app.get("/status", async (req, res) => {
    res.json({
        "status": "IDLE", //default, fetch status from log in future
    });
    // const db = await connectToDatabase();
    // const status = await db.collection("metric-strings")
    //         .find({"key": "dealmaking_status"})
    // res.json({status});
});


// get all dataset metadata
app.get("/datasets", async (req, res) => {
    const db = await connectToDatabase();
    const datasets = await db.collection("datalad-datasets-test1").find({}).toArray();
    res.json({datasets});
});

// get single dataset
app.put("/dataset", async (req, res) => {
    const db = await connectToDatabase();
    const dataset = await db.collection("datalad-datasets-test1")
                             .findOne(
                                 {"dataset_name_datalad": req.body.name}
                             );
    console.log("request json: ", req.body);
    res.json({dataset});
});

//////////////////////////////////////
// one time - populating metadata table with initial values
// I don't expect the number of datasets to change soon, so this is fine for now
// I'll run a separate one time script to call this from the datalad output
app.post("/initialize", async (req, res) => {
    const db = await connectToDatabase();
    // const text = req.body.text;
    console.log(req.body);

    const COLLECTION = "datalad-datasets-test1"

    const entry_exists = await db.collection(COLLECTION).countDocuments(
        {"dataset_name_datalad": req.body.name},
        limit=1
    );

    if(entry_exists) {
        console.log(req.body.name, "already exists");
        const entry = await db.collection(COLLECTION).findOne(
            {"dataset_name_datalad": req.body.name}
        );

        res.send(entry);
    }
    else {
        const metadata_json_object = {
            // "dataset_id": new_id, # <for uniqueness, will probably use this in Coral Metadata later on>
            "dataset_name_datalad": req.body.name, // # TODO: add name here
            "dataset_size": req.body.size, // size of raw dataset in KB
            "archived": false,
            "description": req.body.description,
            "specification": req.body.specification, // BIDS, NWB, DICOM, etc.
            "license": req.body.license, // GPL, MIT, etc.
            "remotes": [], // list of git-annex remotes, leaving empty for now. can retro-populate this from datalad metadata
            "estuary_dealid": "",
            "CID": null,
            "missing_files": [], // format for this? for now maybe just the directory paths
            "num_pieces": 1, //default for <32GB
            // "piece_CIDs: [array of CIDs in order]"
            // dataset_hash: <some sort of hash digest of entire dataset - for verifiability,
            // deal info - length, nodes, etc. Expiry datetime (for filtering)
            // attribution ?
            // ID - like DOIs - assigned on creation
        }

        const entry = await db.collection(COLLECTION)
                                .insertOne(metadata_json_object);

        res.send(metadata_json_object);
    }
});



//////////////////////////////////////////////////
// create server
app.listen(port, () => {
    console.log("Server is running on port ", port);
});
