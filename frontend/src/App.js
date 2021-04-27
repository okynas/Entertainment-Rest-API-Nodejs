import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from "./components/home"

function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}/>
        {/* <Route path="/about" component={About}/> */}
        {/* <Route path="/etater" component={Projects}/> */}
        {/* <Route path="/etate/:projectID" component={OneProject}/> */}
      </Switch>
    </Router>
    </>
  );
}

export default App;
