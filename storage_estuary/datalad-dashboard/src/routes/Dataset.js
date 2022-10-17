import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"

import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Accordion from '@mui/material/Accordion'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'

import JSONPretty from 'react-json-pretty'

import { JsonToTable } from 'react-json-to-table'

export default function Dataset() {
    let params = useParams()

    const [dataset, setDataset] = useState(null)
    // const [name, setName] = useState('')

    const PUT_URL = "http://142.93.66.228:3001/dataset"
    
    // const [cidUrl, setCidUrl] = useState("http://ipfs.io/")
    const [alternateUrl, setAlternateUrl] = useState("https://dweb.link/")
    useEffect(() => {
        fetch(PUT_URL, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name":params.datasetName})
        })
        .then(res => res.json())
        .then(result => {
            setDataset(result.dataset)
	    console.dir(result.dataset)
	    //setCidUrl("https://ipfs.io/ipfs/" + result.dataset.CID)
	    setAlternateUrl("https://dweb.link/ipfs/" + result.dataset.CID)
        })
    }, [])

    const [showRawJSON, setShowRawJSON] = useState(false);

    const handleJSONSwitch = (e) => {
        setShowRawJSON(e.target.checked);
    }

    return (
        <Paper elevation={1}>
            <>
                {dataset &&
                    <main style={{ padding: "1rem" }}>
                        <h2>{dataset.dataset_name_datalad}</h2>

                        <p> <b>Archived</b>: <em>{dataset.archived ? 'yes' : 'no'}</em></p>

                        {dataset.archived &&
                            <>
                                <div>
					                Show Raw JSON <Switch checked={showRawJSON} onChange={handleJSONSwitch} />
                                </div>
                                <div>
					                <b>Description</b>: <br />
                                    {showRawJSON && <JSONPretty data={dataset.description} />}
				                    {!showRawJSON && <JsonToTable json={dataset.description} />}
                                </div>
                                <div>
                                    <b>Subdatasets</b>
                                    {Object.keys(dataset.subdataset_info_dict).map((key, index) => (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id={key}>
                                            <Typography>{key}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <JSONPretty data={dataset.subdataset_info_dict[key]} />
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </div>
                                <p> <b>CID</b>: <em>{dataset.CID}</em></p>
				                <p> <b>dweb.link gateway</b>: <Link href={alternateUrl}>{alternateUrl}</Link></p>
                                
				                <p> <b>Estuary Deal ID</b>: <em>{dataset.estuary_dealid}</em></p>
				                <p> <b>Size</b>: <em>{dataset.size}</em></p>
                                
				                <h4>Missing Filepaths:</h4>
                                <JSONPretty data={dataset.missing_files} />

			                </>
                        }
                    </main>
                }
            </>

            <>
                {!dataset && <p>Dataset <b>{params.datasetName}</b> not found!</p>}
            </>

        </Paper>
    )
}
