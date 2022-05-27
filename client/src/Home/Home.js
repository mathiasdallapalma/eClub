import React, { useEffect } from 'react';


/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Home.css"

import session from '../index';

const Home = ()=>{

    useEffect(()=>{
        console.log(session);
    });

    
    return (
        <div className="home">
            <Sidebar />
            <Topbar />
        </div>
        
    );
}

export default Home;