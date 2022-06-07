import Axios  from 'axios';
import React, { useEffect, useState } from 'react';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import PersonIcon from '@mui/icons-material/Person';

/*Style*/
import "./Anagrafica.css";



const Anagrafica = ()=>{

    const [tesseratiList,settesseratiList]=useState([]);

    
    //setUser(JSON.parse(sessionStorage.getItem("user")));

    const fetchData = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v1/user',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        
        handler(response.data);
    }

    useEffect(()=>{
        
        if(tesseratiList.length==0){
            fetchData(settesseratiList);
        }
        

        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga
                window.location.href="/login";
                break;
            case "1": //dd
               
                break;
            case "2": //tm
                document.getElementById("CreaBtn1").style.display="none";
                break;
            case"3": //ch
                document.getElementById("CreaBtn1").style.display="none";
                break;
        }
    },[tesseratiList]);

    const crea=()=>{
        window.location.href = "/creaTesserato";   
    };

    return (
        <div className="Anagrafica">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Tesserati:</h1>
                    <div className="btnContainer"><button id="CreaBtn1" onClick={crea}>Nuovo Tesserato</button></div>
                </div>
                <table cellspacing ="0" className='AnagraficaList'>
                <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td> <td><h1>Indirizzo</h1></td>  <td><h1>Email</h1></td> <td><h1>Telefono</h1></td></tr>
                    {tesseratiList.map((val,key) => {
                        return( 
                            
                            <tr id="row" onClick={()=>{const path="/anagrafica/"+val._id;
                                window.location.pathname=path}}>
                                {" "}
                                <td style={{width:"2%"}}><PersonIcon id="icon"/></td> <td style={{width:"15%"}}><h2>{val.name} {val.surname}</h2></td> <td style={{width:"12%"}}><h2>{(val.birth).split("T")[0]}</h2></td> <td style={{width:"25%"}}><h2>{val.street} {val.city}</h2></td>  <td style={{width:"13%"}}><h2>{val.email}</h2></td> <td><h2>{val.phone}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>
            
        </div>
        
    );
}


export default Anagrafica;