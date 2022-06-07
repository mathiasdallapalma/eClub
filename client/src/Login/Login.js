import React, {useState,} from 'react';
import Axios from 'axios';
import jwt_decode from 'jwt-decode';

/*Components*/
import MailIcon from '@mui/icons-material/LocalPostOffice';
import KeyIcon from '@mui/icons-material/Key';
import { Checkbox } from '@mui/material';

/*Style*/
import './Login.css';

import session from '../index.js';

const Login = ()=>{
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState('');

    const login=()=>{
        console.log(email+' '+password);
        Axios.post('https://is-eclub.herokuapp.com/api/v1/auth',{
            email: email,
            password: password,
        }).then((response)=>{
                if(response.status=="200"){
                    const token=response.data;
                    const user_data=jwt_decode(token);
                    
                    sessionStorage.setItem("token",token);
                    sessionStorage.setItem("loggedIn",true);
                    sessionStorage.setItem("user_id",user_data._id);
                    sessionStorage.setItem("user_a_type",user_data.a_type);


                    window.location.href="/home";
                }else{
                    window.alert("Email o password errate, riprova");
                    console.log(response);
                }
            }).catch((error)=>{
                window.alert("Email o password errate, riprova");
                console.log(error);
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




