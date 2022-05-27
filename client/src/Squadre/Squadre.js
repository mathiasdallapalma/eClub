import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Squadre.css"
import session from '../index.js'




const Squadre = ()=>{
    const [squadreList,setSquadreList]=useState([]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/api/v1/team').then((response)=>{
            if(response.status=="200"){
                setSquadreList(response.data);
            }else{
                //TODO mostra popup
            }
        });

        switch(session.user.tipo){
            case "0": //ga
                
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                document.getElementById("CreaBtn").style.display="none";
                break;
            case"3": //ch
                document.getElementById("CreaBtn").style.display="none";
                break;
        }
    },[]);

    squadreList.push({
        id:"asdw2212",
        category:"AC Super",
        tm:"Giorgio Penna",
        coach:"Aldo",
        players:"22"
    })

    const crea=()=>{
        window.location.href = "/creaSquadra";
        
    };

    return (
        <div className="Squadre">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Squadre amministrate:</h1>
                    <div class="btnContainer"><button id="CreaBtn" onClick={crea}>Crea Squadra</button></div>
                </div>
                <table cellspacing ="0" className='SquadreList'>
                    <tr id="header"><td><h1>Nome</h1></td><td><h1>Team Manager</h1></td><td><h1>Coach</h1></td><td><h1>Tesserati</h1></td></tr>
                    {squadreList.map((val,key) => {
                        return( 
                            <tr id="row" onClick={()=>{const path="/squadra/"+val.id;
                                window.location.pathname=path}}>
                                {" "}
                                <td><h2>{val.category}</h2></td> <td><h2>{val.tm}</h2></td> <td><h2>{val.coach}</h2></td> <td><h2>{val.players}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>
            
        </div>
        
    );
}

export default Squadre;