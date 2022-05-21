import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'; 

import './App.css';

function App() {

  
  import Login from './Login/Login';
  import Recupero from './Login/Recupero';
 
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/recupero">
            <Recupero />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
