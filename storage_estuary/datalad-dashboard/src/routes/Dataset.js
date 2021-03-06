import { useParams } from "react-router-dom";
import { getDataset } from '../utils/data'

export default function Dataset() {
    let params = useParams()
    let dataset = getDataset(params.datasetName)

    return (
        <>
            <>
                {dataset &&
                    <main style={{ padding: "1rem" }}>
                        <h2>{dataset.name}</h2>
                        <p>{dataset.description}</p>
                        <p>Archived: {dataset.added ? 'yes' : 'no'}</p>
                        <p>CID: {dataset.CID}</p>
                        <p>Size: {dataset.size}</p>
                    </main>
                }
            </>

            <>
                {!dataset && <p>Dataset <b>{params.datasetName}</b> not found!</p>}
            </>

        </>
    )
}
