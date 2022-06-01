import React, { useEffect,useState } from 'react';
import Axios from 'axios';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Home.css"

const Home = ()=>{
    
    
    
    useEffect( () => {
        if(sessionStorage.getItem('loggedIn')==false){
            window.location.href="/login";
        }
        console.log(sessionStorage.getItem('loggedIn')==false)
        
    });
 
    return (
        <div className="home">
            <Sidebar />
            <Topbar />
        </div>
        
    );
}

export default Home;