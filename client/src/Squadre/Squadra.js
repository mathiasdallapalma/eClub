import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Squadra.css";


/* Icons */
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

import { useParams } from 'react-router-dom';




const Squadra = ()=>{
    //const [squadra,setSquadreList]=useState([]);
    const squadra={id:"id",categoria:"cat",teamManager:"Pierpaolo",coach:"Gilberto"};
    const [tesseratiList,setTesseratiList]=useState([]);

    const params=useParams();


    
    useEffect(()=>{
        Axios.get('http://localhost:3001/squadra/'+params.id).then((response)=>{
            if(response.status=="200"){
                //setSquadra(response.data);
            }else{
                //TODO mostra popup
            }
        });
        Axios.get('http://localhost:3001/squadra/'+params.id+"/tesserati").then((response)=>{
            if(response.status=="200"){
                //setTesseratiList(response.data);
            }else{
                //TODO mostra popup
            }
        });

        tesseratiList.push({
            id:"001",
            name: "Giorgio Vanni",
            birth: "01/01/2000",
            address: "CASA",
            iscritto: "iscrizione effettuata"
        });
        tesseratiList.push({
            id:"003",
            name: "Giorgio Scarpa",
            birth: "23/54/3000",
            address: "home",
            iscritto: "iscrizione effettuata"
        });

        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga
                document.getElementById("modificaBtn").style.display="none";
                document.getElementById("eliminaBtn").style.display="none";
                document.getElementById("AnagraficaList").style.display="none";
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                document.getElementById("modificaBtn").style.display="none";
                document.getElementById("eliminaBtn").style.display="none";
                break;
            case"3": //ch
                document.getElementById("modificaBtn").style.display="none";
                document.getElementById("eliminaBtn").style.display="none";
                break;
        }
    },[]);

    const modifica=()=>{
        const path=params.id+"/modifica"
        window.location.href =path;
    };

    const elimina=()=>{
        console.log(squadra.id);
        /*
        Axios.post('http://localhost:3001/',{
           
        });
        */
        window.location.href = "javascript:history.back()";
    };

    return (
        <div className="Squadra">
            <Sidebar />
            <div>
                <Topbar /> 
                <div className='title'>
                    <h1>Scheda Squadra</h1>
                    <button className="modificaBtn" id="modificaBtn" onClick={modifica}>Modifica dati</button>
                    <button className="eliminaBtn" id="eliminaBtn" onClick={elimina}><DeleteIcon /></button>
                </div>  
                <div className='topDiv'>
                    <img src="img.jpg" id="profileImg"></img>
                    <div className='datiSquadra'>
                        <h3>INFORMAZIONI GENERALI</h3>
                        <h1> {squadra.categoria}</h1>
                        <h2> TM: {squadra.teamManager} | CH: {squadra.coach} </h2>
                    </div>
                </div> 
                <h1 className="tabellaTitle">Tesserati</h1>
                <table cellspacing ="0" className='AnagraficaList' id="AnagraficaList">
                <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {tesseratiList.map((val,key) => {
                        return( 
                            <tr id="row" onClick={()=>{const path="/anagrafica/"+val.id;
                                window.location.pathname=path}}>
                                {" "}
                                <td><PersonIcon id="icon"/></td> <td><h2>{val.name}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>          
            </div>
            
        </div>
        
    );
}

export default Squadra;