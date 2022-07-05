import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import JSONPretty from 'react-json-pretty'

export default function Dataset() {
    let params = useParams()

    const [dataset, setDataset] = useState(null)
    // const [name, setName] = useState('')

    const PUT_URL = "http://142.93.66.228:3001/dataset"
    
    const [cidUrl, setCidUrl] = useState("http://ipfs.io/")
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
	    setCidUrl("https://ipfs.io/ipfs/" + result.dataset.CID)
	    setAlternateUrl("https://dweb.link/ipfs/" + result.dataset.CID)
        })
    }, [])

    return (
        <Paper elevation={1}>
            <>
                {dataset &&
                    <main style={{ padding: "1rem" }}>
                        <h2>{dataset.dataset_name_datalad}</h2>

                        <p>Archived: <em>{dataset.archived ? 'yes' : 'no'}</em></p>

                        {dataset.archived &&
                            <>
                                <p>
					Description: 
					<JSONPretty data={dataset.description} />
				</p>
                                <p>CID: <i>{dataset.CID}</i></p>
				<p>dweb.link gateway: <Link href={alternateUrl}>{alternateUrl}</Link></p>
                                
				<p>Estuary Deal ID: <i>{dataset.estuary_dealid}</i></p>
				<p>Size: {dataset.size}</p>
                                
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
