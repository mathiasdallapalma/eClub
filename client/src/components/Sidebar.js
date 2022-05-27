import React from 'react';
import { useEffect } from 'react';
import SidebarData from './SidebarData';
import 'typeface-roboto';
import session from '../index.js';

import "./Sidebar.css"

const Sidebar = ()=>{
    const profileLink="anagrafica/"+session.user.id;
    
    useEffect(() => {

        switch(session.user.tipo){
            case "0": //ga
                document.getElementById("anagrafica").style.display="none";
                document.getElementById("squadre").style.display="none";
                break;
            case "1": //dd
                document.getElementById("squadra").style.display="none";
                break;
            case "2": //tm
                document.getElementById("squadra").style.display="none";
                break;
            case"3": //ch
                document.getElementById("meds").style.display="none";
                document.getElementById("squadra").style.display="none";
                break;
                
        }
    });

    return (
        <div className="Sidebar">
            <div className='SidebarHeader'>
                <img src="img.jpg" id="profileImg"></img>
                <a href={profileLink}><h3 >{session.user.nome} {session.user.cognome}</h3></a>
            </div>
            <ul className="SidebarList" id="SidebarList"> 
                {SidebarData.map((val, key) => {
                    return(
                        <li key={key} className="row" 
                            onClick={()=>{window.location.pathname=val.link}}
                            id={val.id}>
                            {" "}
                            <div id="icon">
                                {val.icon}
                            </div>{" "}
                            <div id="title">
                                {val.title}
                            </div>
                        </li>
                    );                    
                })}
            </ul>
        </div>
        
    );
}

export default Sidebar;