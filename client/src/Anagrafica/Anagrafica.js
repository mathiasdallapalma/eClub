import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

import PersonIcon from '@mui/icons-material/Person';

//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Anagrafica.css";
import session from '../index.js';

const Anagrafica = ()=>{

    const [tesseratiList,settesseratiList]=useState([]);

    tesseratiList.push({
        id:"001",
        name: "Giorgio Vanni",
        birth: "01/01/2000",
        address: "CASA",
        iscritto: "iscrizione effettuata",
        email:"asd@fas.da",
        telefono:"samsun"
    });
    tesseratiList.push({
        id:"003",
        name: "Giorgio Scarpa",
        birth: "23/54/3000",
        address: "home",
        iscritto: "iscrizione effettuata",
        email:"asd@fas.da",
        telefono:"nokia"
    });

    useEffect(()=>{
        Axios.get('http://localhost:3001/squadre').then((response)=>{
            
        })
        switch(session.utente.tipo){
            case "0": //ga
                
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                document.getElementById("CreaBtn1").style.display="none";
                break;
            case"3": //ch
                document.getElementById("CreaBtn1").style.display="none";
                break;
        }


    },[]);

    const crea=()=>{
        window.location.href = "/creaTesserato";   
    };

    const gotoProfile=(key)=>{
        console.log(key);
    }

    return (
        <div className="Anagrafica">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Tesserati:</h1>
                    <div className="btnContainer"><button id="CreaBtn1" onClick={crea}>Nuovo Tesserato</button></div>
                </div>
                <table cellspacing ="0" className='AnagraficaList'>
                <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td> <td><h1>Indirizzo</h1></td> <td><h1>Iscirizione</h1></td> <td><h1>Email</h1></td> <td><h1>Telefono</h1></td></tr>
                    {tesseratiList.map((val,key) => {
                        return( 
                            <tr id="row" onClick={()=>{const path="/anagrafica/"+val.id;
                                window.location.pathname=path}}>
                                {" "}
                                <td style={{width:"20px"}}><PersonIcon id="icon"/></td> <td><h2>{val.name}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td> <td><h2>{val.email}</h2></td> <td><h2>{val.telefono}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>
            
        </div>
        
    );
}


export default Anagrafica;