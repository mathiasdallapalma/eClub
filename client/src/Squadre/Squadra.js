import Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Squadra.css";


/* Icons */
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';






const Squadra = ()=>{
    //const [squadra,setSquadreList]=useState([]);

    const [squadra,setSquadra]=useState([]);
    const [players,setPlayersList]=useState([]);

    const params=useParams();

    const getSquadra = async(handler) => {/*
        let response= await Axios.get('http://localhost:3001/api/v1/team/'+params.id,{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
            handler(response.data);
            */
           handler({
            _id: "62927ddbc8a1c137d5e6cc23",
            category: "Super22",
            players: "[62927a8fc8a1c137d5e6cbf6,62927a8fc8a1c137d5e6cgb4]",
            coach: "629272f3c8a1c137d5e6ca6c",
            tm: "62927232c8a1c137d5e6ca4f",
            status: 0,
            hidden: 0,
            added_by: "629096428ac032433daba53e",
            created_at: "2022-05-22T19:12:13.819Z",
            __v: 0
          })
          console.log(squadra.players)
          //settesseratiList(JSON.parse(squadra.players))
        };


    
    useEffect(()=>{
        if(sessionStorage.getItem('loggedIn')==false){
            window.location.href="/login";
        }else{
            if(squadra.length==0){
                getSquadra(setSquadra);
            }
        }

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
        
        if(squadra.length!=0){
            var temp=squadra.players
            temp=temp.replace("[","[\"");
            temp=temp.replace("]","\"]");
            temp=temp.replace(",","\",\"");
            console.log(temp)
            
            setPlayersList(JSON.parse(temp));
        }
    },[squadra]);

    const modifica=()=>{
        const path=params.id+"/modifica"
        window.location.href =path;
    };

    const elimina=()=>{
        console.log(params.id);
        Axios.delete('http://localhost:3001/api/v1/team/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')},
        params:{
            _id:params.id}
        }).then((response)=>{
            window.alert("Squadra eliminata correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        });
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
                        <h1> {squadra.category}</h1>
                        <h2> TM: {squadra.tm} | CH: {squadra.coach} </h2>
                    </div>
                </div> 
                <h1 className="tabellaTitle">Tesserati</h1>
                <table cellspacing ="0" className='AnagraficaList' id="AnagraficaList">
                <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {players.map((val,key) => {
                        return( 
                            <tr id="row" onClick={()=>{const path="/anagrafica/"+val.id;
                                window.location.pathname=path}}>
                                {" "}
                                <td><PersonIcon id="icon"/></td> <td><h2>{val}{val.name} {val.surname}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>          
            </div>
            
        </div>
        
    );
}

export default Squadra;