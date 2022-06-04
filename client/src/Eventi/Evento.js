import React, { useEffect,useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Evento.css"

/*Icons*/
import DeleteIcon from '@mui/icons-material/Delete';

const Evento = ()=>{
    const params=useParams();

    const [evento,setEvento]=useState(0);
    const [eventType,setEventType]=useState("");
    const [dateString,setDateString]=useState("");

    const fetchData = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v2/event/'+params.id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        
        handler(response.data);
        setEventType(response.data.e_type.name);

        var dateString=(response.data.date).replace("T"," ");
        dateString=dateString.replace(":00.000Z","");

        setDateString(dateString);
        
        
    }

 
    
    useEffect(()=>{

            if(!evento){
                fetchData(setEvento);
            }
        sessionStorage.setItem('event_toModify', JSON.stringify(evento));


        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga
                document.getElementById("eliminaBtn").style.display="none";
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                document.getElementById("eliminaBtn").style.display="none";
                break;
            case"3": //ch
                document.getElementById("eliminaBtn").style.display="none";
                break;
        }
    },[evento]);

    const elimina=()=>{
        Axios.delete('http://localhost:3001/api/v2/event/'+params.id,{
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

    
                        
 
    return (
        <div className="evento">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Scheda Evento</h1>

                    <button className="eliminaBtn" id="eliminaBtn"onClick={elimina}><DeleteIcon /></button>
                </div> 
                <div className='topDiv'>
                    <h1>{eventType} : </h1>
                    <div className='datiUtente'>
                        <h1>{evento.title}</h1>
                        <h2>{dateString}</h2>
                        <h3>{evento.description}</h3>
                    </div>
                </div> 
            </div>
        </div>
        
    );
}

export default Evento;