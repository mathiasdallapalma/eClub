import React, {useState,} from 'react';
import Axios from 'axios';

import './Recupero.css';

const Recupero = ()=>{
    const[email,setEmail]=useState("");

    const recupero=()=>{
        console.log(email);
        Axios.post('http://localhost:3001/recupero',{
            user: email,
           
        });
    };
    const annulla=()=>{
        window.location.href = "/login";
        
    };

    return (
        <div className="Recupero">
            <h2>Trova il tuo account</h2>
            <h3>Inserisci l'email per cercare il tuo account</h3>
            <input 
                type="text"
                placeholder='example@gmail.com'
                onChange={(event)=>{
                setEmail(event.target.value)}
                }
            />
            <div className='btns'>
                <button id="Abtn" onClick={annulla}>Annulla</button>
                <button id="Rbtn" onClick={recupero}>Cerca</button>
            </div>
        </div>
      );
      
}

export default Recupero;