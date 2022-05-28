import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Squadre.css"





const Squadre = ()=>{
    const [squadreList,setSquadreList]=useState([]);
    const [tms,setTms]=useState([]);


    const getSquadre = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/team',{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
            handler(response.data);
        };
    const getTms = async(handler) => {
        for(var i=0;i<squadreList[i];i++){
            let response= await Axios.get('http://localhost:3001/api/v1/user/'+squadreList[i].tm,{
                headers:{
                    "auth-token":sessionStorage.getItem('token')}
                })
            handler(response.data);
        }};
    
    useEffect( () => {
        if(sessionStorage.getItem('loggedIn')==false){
            window.location.href="/login";
        }else{
            if(squadreList.length==0){
                getSquadre(setSquadreList);
            }

            switch(sessionStorage.getItem('user_a_type')){
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
        }
    },[squadreList]);

   

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
                    <div className="btnContainer"><button id="CreaBtn" onClick={crea}>Crea Squadra</button></div>
                </div>
                <table cellSpacing ="0" className='SquadreList'>
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