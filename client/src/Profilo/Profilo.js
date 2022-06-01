import Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Profilo.css"





const Profilo = ()=>{
    /*getting user id*/
    const params=useParams();

    const [user,setUser]=useState("");

    const fetchData = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/user/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        
        console.log(response.data)
        handler(response.data);
    }

 
    
    useEffect(()=>{
        if(params.id==sessionStorage.getItem("user_id")){
            setUser(JSON.parse(sessionStorage.getItem("user")));
            document.getElementById("eliminaBtn").style.display="none";
        }else{
            if(!user){
                fetchData(setUser);
            }
        }
        sessionStorage.setItem('user_toModify', JSON.stringify(user));


        switch(sessionStorage.getItem('user_a_type')){
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
    },[user]); //TODO useffect keeps calling

    const modifica=()=>{
        const path=params.id+"/modifica"
        window.location.href =path;
    };

    const elimina=()=>{
        Axios.delete('http://localhost:3001/api/v1/user/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')},
        params:{
            _id:params.id}
        }).then((response)=>{
            window.alert("Profilo modificato correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        });
        window.location.href = "/anagrafica";
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
                        <h1> {user.name} {user.surname}</h1>
                        <h2> {user.email} | {user.phone} | {user.dataNascita}</h2>
                        <h2> {user.street} | {user.city} ({user.zip}) | {user.province}, {user.nation}</h2>
                    </div>
                </div>           
            </div>
            
        </div>
        
    );
}

export default Profilo;