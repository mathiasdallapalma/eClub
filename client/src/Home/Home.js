import React, { useEffect,useState } from 'react';
import Axios from 'axios';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Home.css"

const Home = ()=>{


    const [user,setUser]=useState(0);
    useEffect( () => {
        setUser(JSON.parse(sessionStorage.getItem("user")));
    },[]);


 
    return (
        <div className="home">
            <Sidebar />
            <div>
                <Topbar />
                <h1>Ciao {user.name}</h1>
            </div>
        </div>
        
    );
}

export default Home;