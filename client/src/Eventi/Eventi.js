import React, { useEffect,useState } from 'react';
import Axios from 'axios';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Eventi.css"

/*Icons*/
import EventIcon from '@mui/icons-material/Event';



const Eventi = ()=>{

    const [user,setUser]=useState(0);
    useEffect( () => {
        setUser(JSON.parse(sessionStorage.getItem("user")));
    },[]);

    const[eventi,setEventi]=useState([]);

    const getAllEventi = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v2/event',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        
        handler(response.data);
        
    }
    const getEventiByTeam = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v2/event/team/'+user.team_id,{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        handler(response.data);
    }

    useEffect(()=>{
        
        if(eventi.length==0){
            if(sessionStorage.getItem('user_a_type')){
                getAllEventi(setEventi);
            }else{
                getEventiByTeam(setEventi);
            }
        }
        

        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga
                window.location.href="/login";
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                //document.getElementById("CreaBtn1").style.display="none";
                break;
            case"3": //ch
                //document.getElementById("CreaBtn1").style.display="none";
                break;
        }
        
    },[eventi]);

    const crea=()=>{
        window.location.href = "/creaEvento";   
    };

 
    return (
        <div className="eventi">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Eventi:</h1>
                    <div className="btnContainer"><button id="CreaBtn1" onClick={crea}>Nuovo Evento</button></div>
                </div>

                <table cellspacing ="0" className='EventList'>
                <tr id="header"> <td><h2></h2></td> <td><h2>Titolo</h2></td> <td><h2>Data</h2></td><td><h2>Squadre</h2></td> </tr>
                    {eventi.map((val,key) => {
                        var dateString=(val.date).replace("T"," ");
                        dateString=dateString.replace(":00.000Z","");
                        var squadreString="";
                        (val.teams).forEach(element => {
                            squadreString=squadreString+element.category+" "
                            
                        });
                        return( 
                            <tr id="row" onClick={()=>{const path="/evento/"+val._id;
                                window.location.pathname=path}}>
                                {" "}
                                <td style={{width:"2%"}}><EventIcon id="icon"/></td> <td style={{width:"5%"}}><h1>{val.title}</h1></td> <td style={{width:"8%"}}><h1>{dateString}</h1></td> <td style={{width:"25%"}}><h1>{squadreString}</h1></td> {" "}
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
    );
}

export default Eventi;