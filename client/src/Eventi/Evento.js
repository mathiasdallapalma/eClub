import React, { useEffect,useReducer,useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Checkbox } from '@mui/material';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Evento.css"

/*Icons*/
import DeleteIcon from '@mui/icons-material/Delete';

const Evento = ()=>{
    const params=useParams();

    const [convocatoString,setConvocatoString]=useState("NON Sei stato convocato per questo evento");

    const [evento,setEvento]=useState(0);
    const [eventType,setEventType]=useState("");
    const [dateString,setDateString]=useState("");

    const fetchData = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v2/event/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        
        handler(response.data);
        setEventType(response.data.e_type.name);

        var dateString=(response.data.date).replace("T"," ");
        dateString=dateString.replace(":00.000Z","");

        setDateString(dateString);        
    }
    const [user,setUser]=useState(0);
    useEffect(()=>{
        setUser(JSON.parse(sessionStorage.getItem("user")));
            if(!evento){
                fetchData(setEvento);
            }else{
                sessionStorage.setItem('event_toModify', JSON.stringify(evento));

                if(evento.e_type.type!=1){
                    document.getElementById("convocazioni").style.display="none";
                    document.getElementById("convocatoString").style.display="none";
                }


                switch(sessionStorage.getItem('user_a_type')){
                    case "0": //ga
                        document.getElementById("eliminaBtn").style.display="none";
                        document.getElementById("convocazioni").style.display="none";
                        break;
                    case "1": //dd
                        document.getElementById("convocazioni").style.display="none";
                        document.getElementById("convocatoString").style.display="none";
                        break;
                    case "2": //tm
                        document.getElementById("eliminaBtn").style.display="none";
                        document.getElementById("convocazioni").style.display="none";
                        document.getElementById("convocatoString").style.display="none";
                        break;
                    case"3": //ch
                        document.getElementById("eliminaBtn").style.display="none";
                        document.getElementById("convocazioni").style.display="none";
                        document.getElementById("convocatoString").style.display="none";
                        break;
                }
            }
    },[evento]);

    const [gas,setGas]=useState([]);
    const [tesseratiList,settesseratiList]=useState([]);

    const getUsers = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v2/summoning/event/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
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
    },[]);

    useEffect(()=>{
            var temp=[];
            var teams=evento.teams
            if(sessionStorage.getItem('loggedIn')==false){
                window.location.href="/login";
            }else{
                if(tesseratiList.length==0){
                    getUsers(settesseratiList); 
                }else{
                    var found = tesseratiList.find(function (element) {
                        return element.player._id==user._id;
                        
                    });
                    console.log(found)

                    if(found){
                        console.log("trovato")
                        if(found.value){
                            setConvocatoString("Sei stato convocato per questo evento")
                            console.log("trovato")
                        }else{
                            setConvocatoString("NON Sei stato convocato per questo evento")
                        }
                    }
                    console.log(user._id)
                }
            }
        },[evento]);

    const elimina=()=>{
        Axios.delete(process.env.URL+'/api/v2/event/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')},
        params:{
            _id:params.id}
        }).then((response)=>{
            window.alert("Evento modificato correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        });
        window.location.href = "/eventi";
    };

    const handleCheckBox = (id,event) => {
        console.log(id)
        var found = tesseratiList.find(function (element) {
            return element._id ==id;
        });
        if(found.value==false){
            Axios.patch("http://localhost:3001/api/v2/summoning/"+id,{
                value: true,
            },
            {headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).catch((error)=>{
                console.log(error.response.data)
                window.alert(error.response.data);
            })
            found.value=true
        }else{
            Axios.patch("http://localhost:3001/api/v2/summoning/"+id,{
                value: false,
            },
            {headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).catch((error)=>{
                console.log(error.response.data)
                window.alert(error.response.data);
            })
            found.value=false
        }

    };
    
                        
 
    return (
        <div className="evento">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Scheda Evento</h1>
                    <button className="eliminaBtn" id="eliminaBtn"onClick={elimina}><DeleteIcon /></button>
                </div> 
                <div className='topDiv1'>
                    <h1>{eventType} : </h1>
                    <div className='datiUtente'>
                        <h1>{evento.title}</h1>
                        <h2>{dateString}</h2>
                        <h3>{evento.description}</h3>
                    </div>
                    <h2 id="convocatoString">{convocatoString}</h2>
                    <div id='convocazioni'>
                        <h1> Convocazioni </h1>
                        <table cellSpacing ="0" className='tesseratiList'>
                        <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> </tr>
                        {tesseratiList.map((val,key) => {
                            return( 
                                <tr id="row">
                                    {" "}
                                    <td id="checbox_td"><Checkbox
                                        defaultChecked={val.value}
                                        onChange={event =>handleCheckBox(val._id,event)} />
                                    </td> 
                                    <td><h2>{val.player.name} {val.player.surname}</h2></td> {" "}
                                </tr>
                            );
                        })}
                        </table>
                    </div>
                </div> 
            </div>
        </div>   
    );
}

export default Evento;