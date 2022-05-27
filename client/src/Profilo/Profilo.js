import Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Profilo.css"
import session from '../index.js';




const Profilo = ()=>{
    /*getting user id*/
    const params=useParams();
    console.log(params.id)

 const utente={id:params.id, 
                name:"Giangiangelo",
                cognome:"Blallo",
                mail:"asd@gmail.com",
                telefono:"30303003032",
                dataNascita:"02/12/2222",
                indirizzo:"asd"
            };
    
    useEffect(()=>{
        switch(session.user.tipo){
            case "0": //ga
                document.getElementById("eliminaBtn").style.display="none";
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                document.getElementById("eliminaBtn").style.display="none";
                document.getElementById("modificaBtn").style.display="none";
                break;
            case"3": //ch
                document.getElementById("eliminaBtn").style.display="none";
                document.getElementById("modificaBtn").style.display="none";
                break;
        }
    },[]);

    const modifica=()=>{
        const path=params.id+"/modifica"
        window.location.href =path;
    };

    const elimina=()=>{
        console.log(utente.id);
        /*
        Axios.post('http://localhost:3001/',{
           TODO api elimina user
        });
        */
        window.location.href = "javascript:history.back()";
    };

    return (
        <div className="Profilo">
            <Sidebar />
            <div>
                <Topbar /> 
                <div className='title'>
                    <h1>Scheda Tesserato</h1>
                    <button className="modificaBtn" id="modificaBtn" onClick={modifica}>Modifica dati</button>
                    <button className="eliminaBtn" id="eliminaBtn"onClick={elimina}><DeleteIcon /></button>
                </div>  
                <div className='topDiv'>
                    <img src="img.jpg" id="profileImg"></img>
                    <div className='datiUtente'>
                        <h3>INFORMAZIONI PERSONALI</h3>
                        <h1> {utente.nome} {utente.cognome}</h1>
                        <h2> {utente.mail} | {utente.telefono} | {utente.dataNascita}</h2>
                    </div>
                </div>           
            </div>
            
        </div>
        
    );
}

export default Profilo;