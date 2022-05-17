import React, { useState, useEffect } from "react";
import {
    Link,
    Outlet
} from "react-router-dom";

import Home from './routes/Home'
import About from './routes/About'

import Status from './components/Status'

function App() {

    const [status, setStatus] = useState(null)

    useEffect(() => {
        fetch("http://localhost:3001/status")
        .then(res => res.json())
        .then(data => {
            setStatus(data.status)
            console.log("response data for /status ", data)
        })
    }, [])
    // empty square brackets means no dependencies for this var, loads only once

    return (
      <div style={{padding: "1rem"}}>
        <h1> datalad dashboard </h1>

        <nav style={{borderBottom: "solid 3px", paddingBottom: "1rem",}} >
            <Link to="/home">Home</Link> |{" "}
            <Link to="/about">About</Link> |{" "}
            <Status status={status}/>
        </nav>

        <div style={{paddingTop: "1rem", paddingBottom: "1rem",}}>
            <Outlet />
        </div>
      </div>
    );
}

export default App;
