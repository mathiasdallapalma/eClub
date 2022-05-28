import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

sessionStorage.setItem("loggedIn",false);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />, 
);


