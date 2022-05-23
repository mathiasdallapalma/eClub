import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const session={
    token:"asd",
    utente:{
        id:"001",
        nome:"nome",
        cognome:"cognome",
        tipo:"1",
        squadra:"100"
    }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />, 
);

export default session;

