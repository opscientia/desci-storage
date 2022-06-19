import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"

export default function Dataset() {
    let params = useParams()

    const [dataset, setDataset] = useState(null)
    // const [name, setName] = useState('')

    const PUT_URL = "http://localhost:3001/dataset"
    useEffect(() => {
        fetch(PUT_URL, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name":params.datasetName})
        })
        .then(res => res.json())
        .then(result => {
            setDataset(result.dataset)
        })
    }, [])

    return (
        <>
            <>
                {dataset &&
                    <main style={{ padding: "1rem" }}>
                        <h2>{dataset.dataset_name_datalad}</h2>

                        <p>Archived: <em>{dataset.archived ? 'yes' : 'no'}</em></p>

                        {dataset.archived &&
                            <>
                                <p>Description: {dataset.description}</p>
                                <p>CID: {dataset.CID}</p>
                                <p>Size: {dataset.size}</p>
                            </>
                        }
                    </main>
                }
            </>

            <>
                {!dataset && <p>Dataset <b>{params.datasetName}</b> not found!</p>}
            </>

        </>
    )
}
