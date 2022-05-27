import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const session={
    token:"",
    user:{
        id:"",
        nome:"",
        cognome:"",
        tipo:"",
        squadra:""
    }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />, 
);

export default session;

