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
   

    const [tm,setTM]=useState(0);
    const [ch,setCH]=useState(0);
    const [gas,setGas]=useState([]);

    const [squadra,setSquadra]=useState([]);
    const [tesseratiList,settesseratiList]=useState([]);

    const params=useParams();

    const getSquadra = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/team/'+params.id,{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).then((response)=>{
                handler(response.data);
            })
            
        };

    useEffect(()=>{
            if(squadra.length==0){
                getSquadra(setSquadra);
            }
        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga
                document.getElementById("modificaBtn").style.display="none";
                document.getElementById("eliminaBtn").style.display="none";
                document.getElementById("AnagraficaList").style.display="none";
                document.getElementById("tabellaTitle").style.display="none";
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
        
        
    },[squadra]);

    const getTesserati = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/user',{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).then((response)=>{
                handler(response.data);
            })
            //settesseratiList(response.data);
                
    }

    useEffect(()=>{
        
        if(tesseratiList.length==0){
            getTesserati(settesseratiList);
        }
        else{
            tesseratiList.forEach(element => {
                if(element.team_id==params.id){
                    switch(element.a_type.type){
                        case 0:
                            gas.push(element)
                            break;
                        case 2:
                            setTM(element);
                            break;
                        case 3:
                            setCH(element);
                            break;
                    }
                }                       
            });
        }
    },[tesseratiList]);

    const modifica=()=>{
        const path=params.id+"/modifica"
        window.location.href =path;
    };

    const elimina=()=>{
        //TODO eliminare team da users 
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

        gas.forEach(element => {
            Axios.patch('http://localhost:3001/api/v1/user/'+element._id,{
                team_id:"000000000000000000000000"
            },
            {headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).then((response)=>{
                //window.alert("Profilo modificato correttamente");
            }).catch((error)=>{
                console.log(error.response.data)
                window.alert(error.response.data);
            })
        })
        Axios.patch('http://localhost:3001/api/v1/user/'+tm._id,{
                team_id:"000000000000000000000000"
            },
            {headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).then((response)=>{
                //window.alert("Profilo modificato correttamente");
            }).catch((error)=>{
                console.log(error.response.data)
                window.alert(error.response.data);
            })
        Axios.patch('http://localhost:3001/api/v1/user/'+ch._id,{
            team_id:"000000000000000000000000"
        },
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            //window.alert("Profilo modificato correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })

        window.location.href = "/squadre";
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
                        <h1>{squadra.category}</h1>
                        <div><h2> TM: {tm.name} {tm.surname}  |</h2><h2>CH: {ch.name} {ch.surname}  </h2></div>
                    </div>
                </div> 
                <h1 className="tabellaTitle" id="tabellaTitle">Tesserati</h1>
                <table cellspacing ="0" className='AnagraficaList' id="AnagraficaList">
                <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Telefono</h1></td></tr>
                    {gas.map((val,key) => {
                        return( 
                            <tr id="row" onClick={()=>{const path="/anagrafica/"+val.id;
                                window.location.pathname=path}}>
                                {" "}
                                <td style={{width:"2%"}}><PersonIcon id="icon"/></td> <td style={{width:"10%"}}><h2>{val.name} {val.surname}</h2></td > <td style={{width:"10%"}}><h2>{(val.birth).split("T")[0]}</h2></td> <td style={{width:"15%"}}><h2>{val.street} {val.city}</h2></td><td style={{width:"25%"}}><h2>{val.phone}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>          
            </div>
            
        </div>
        
    );
}

export default Squadra;