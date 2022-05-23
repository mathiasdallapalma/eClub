import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'; 

import './App.css';

import Login from './Login/Login';
import Recupero from './Login/Recupero';
import Home from './Home/Home';

function App() {

  
  
 
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
          <Route exact path="/home">
          <Home />
        </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
