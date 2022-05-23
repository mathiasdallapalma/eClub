import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'; 

import './App.css';

import Home from './Home/Home';
import Login from './Login/Login';
import Recupero from './Login/Recupero';
import Squadre from './Squadre/Squadre';
import CreaSquadra from './Squadre/CreaSquadra';
import Anagrafica from './Anagrafica/Anagrafica';
import NuovoTesserato from './Anagrafica/NuovoTesserato';
import Profilo from './Profilo/Profilo';
import Squadra from './Squadre/Squadra';
import ModificaProfilo from './Profilo/ModificaProfilo';
import ModificaSquadra from './Squadre/ModificaSquadra';


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
          <Route exact path="/squadre">
            <Squadre />
          </Route>
          <Route exact path="/squadra/:id">
            <Squadra />
          </Route>
          <Route exact path="/squadra/:id/modifica">
            <ModificaSquadra />
          </Route>
          <Route exact path="/creaSquadra">
            <CreaSquadra />
          </Route>
          <Route exact path="/anagrafica">
            <Anagrafica />
          </Route>
          <Route exact path="/anagrafica/:id">
            <Profilo />
          </Route>
          <Route exact path="/anagrafica/:id/modifica">
            <ModificaProfilo />
          </Route>
          <Route exact path="/creaTesserato">
            <NuovoTesserato />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
