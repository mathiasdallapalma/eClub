import React, {useState,} from 'react';
import Axios from 'axios';

import MailIcon from '@mui/icons-material/LocalPostOffice';
import KeyIcon from '@mui/icons-material/Key';

import './Login.css';
import { Checkbox } from '@mui/material';

const Login = ()=>{
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState('');

    const login=()=>{
        console.log(email+' '+password);
        Axios.post('http://localhost:3001/login',{
            user: email,
            password: password,
        });
    };




    return (
        <div className="Login">
            <div className='image'></div>
            <div className='loginForm'>
                <h1 id="welcome">Welcome</h1>
                <h1 id="toeClub">to eClub</h1>
                <label id="userLabel">Username</label>
                <div className='userInput'>
                    <MailIcon id="mailIcon" />                
                    <input 
                        id="userInputText"
                        type="text"
                        placeholder='example@gmail.com'
                        onChange={(event)=>{
                        setEmail(event.target.value)}
                        }
                        required maxLength={256}
                    />
                </div>
                <label id="passLabel">Password</label>
                <div className='passInput'> 
                    <KeyIcon id="keyIcon" />        
                    <input 
                        id="passInputText"
                        type="password"
                        placeholder='******'
                        onChange={(event)=>{
                        setPassword(event.target.value)}
                        }
                    />
                </div>
                <div className='check_and_missed'>
                    <Checkbox id='checkbox'></Checkbox>
                    <h3>Ricorda le credenziali</h3>
                    <a  href="/recupero">Hai dimenticato la password?</a>
                </div>


                <button onClick={login}>Login</button>


                <div className='contatta'>
                    <h3>Non hai un account?</h3>
                    <a href="/contatta">Contatta la società</a>
                </div>
                <a href="/home">home</a>
            </div>
        </div>
      );
      
}

export default Login;




