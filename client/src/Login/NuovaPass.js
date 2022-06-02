import React, {useState,} from 'react';
import Axios from 'axios';

import './NuovaPass.css';

const NuovaPass = ()=>{
    const[pass,setPass]=useState("");
    const[pass1,setPass1]=useState("");

    const reimposta=()=>{
        if(pass==pass1){
            console.log(pass+pass1);
            Axios.post('http://localhost:3001/recupero',{
                user: pass,
            });
        }else{
            //TODO popup errore
        }
    };
   
    return (
        <div className="NuovaPass">
            <h2>Reimpostazione password</h2>
            <h3>Inserisci la nuova password per il tuo account</h3>
            <input 
                type="text"
                placeholder='password'
                onChange={(event)=>{
                setPass(event.target.value)}
                }
            />
            <input 
                type="text"
                placeholder='password'
                onChange={(event)=>{
                setPass1(event.target.value)}
                }
            />
            <div className='btns'>
                <button id="Rbtn" onClick={reimposta}>reimposta</button>
            </div>
        </div>
      );
      
}

export default NuovaPass;