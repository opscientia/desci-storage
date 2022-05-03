import * as React from 'react';
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
  let rows = getDatasets()

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Added?</TableCell>
            <TableCell align="right">CID</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">

                <Link to={`/datasets/${row.name}`}>{row.name}</Link>
              </TableCell>
              <TableCell align="right">{row.added ? 'yes' : 'no'}</TableCell>
              <TableCell align="right">{row.CID}</TableCell>
              <TableCell align="right">{row.size}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
