import React from "react";
import {
    Link,
    Outlet
} from "react-router-dom";

import Home from './routes/Home'
import About from './routes/About'

function App() {
  return (
      <div style={{padding: "1rem"}}>
        <h1> datalad dashboard </h1>

        <nav style={{borderBottom: "solid 3px", paddingBottom: "1rem",}} >
            <Link to="/home">Home</Link> |{" "}
            <Link to="/about">About</Link>
        </nav>

        <div style={{paddingTop: "1rem", paddingBottom: "1rem",}}>
            <Outlet />
        </div>
      </div>
  );
}

export default App;
