import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'

import { getDatasets } from '../utils/data'

export default function Home() {
    // let rows = getDatasets()
    const db_url = "http://142.93.66.228:3001/datasets"

    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetch(db_url)
        .then(res => res.json())
        .then(data => {
            console.log("response for /datasets ", data.datasets)
            setRows(data.datasets)
        })
    }, [])

    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Archived</TableCell>
                <TableCell align="right">CID</TableCell>
                <TableCell align="right">Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">

                    <Link to={`/datasets/${row.dataset_name_datalad}`}>{row.dataset_name_datalad}</Link>
                  </TableCell>
                  <TableCell align="right">{row.archived ? 'yes' : 'no'}</TableCell>
                  <TableCell align="right">{row.CID}</TableCell>
                  <TableCell align="right">{row.dataset_size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </TableContainer>
);
}
