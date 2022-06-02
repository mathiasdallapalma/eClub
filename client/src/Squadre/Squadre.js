import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Squadre.css"





const Squadre = ()=>{
    const [squadreList,setSquadreList]=useState([]);
    const [tesseratiList,settesseratiList]=useState([]);

    const getSquadre = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/team',{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
            var temp=response.data;
            temp=temp.filter(function(ele){ 
                return ele._id != "000000000000000000000000"; 
            });
            response= await Axios.get('http://localhost:3001/api/v1/user',{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
            settesseratiList(response.data);
             
        
            handler(temp);
        };
    
    useEffect( () => {
        if(sessionStorage.getItem('auth-token')===undefined){
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
                    <tr id="header"><td><h1>Categoria</h1></td><td><h1>Team Manager</h1></td><td><h1>Coach</h1></td><td><h1>Tesserati</h1></td></tr>
                    {squadreList.map((val,key) => {
                        var ch,tm;
                        var gaSize=0
                        tesseratiList.forEach(element => {
                            console.log(element.name)
                            if(element.team_id==val._id){
                                console.log("true")
                                switch(element.a_type.type){
                                    case 0:
                                        gaSize++;
                                        break;
                                    case 2:
                                        tm=element;
                                        break;
                                    case 3:
                                        ch=element
                                        break;
                                }
                            }                       
                        });
                        return( 
                            <tr id="row" onClick={()=>{const path="/squadra/"+val._id;
                                window.location.pathname=path}}>
                                {" "}
                                <td><h2>{val.category}</h2></td> <td><h2>{tm.name} {tm.surname}</h2></td> <td><h2>{ch.name} {ch.surname}</h2></td> <td><h2>{gaSize}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>
            
        </div>
        
    );
}

export default Squadre;