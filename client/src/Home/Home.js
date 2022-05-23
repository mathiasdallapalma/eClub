import React from 'react';


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./Home.css"




const Home = ()=>{
    return (
        <div className="home">
            <Sidebar />
            <Topbar />
        </div>
        
    );
}

export default Home;