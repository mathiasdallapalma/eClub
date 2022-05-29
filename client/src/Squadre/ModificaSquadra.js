import { Checkbox } from '@mui/material';
import Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


/* Components */
import InputText from '../components/InputText';
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./ModificaSquadra.css"




const ModificaSquadra = ()=>{
    const [coaches,setCoaches]=useState([]);
    const [tms,setTms]=useState([]);
    const [gas,setGas]=useState([]);

    const [squadra,setSquadra]=useState([]);
    const [tesseratiList,setTesseratiList]=useState([]);

    const params=useParams();

    const getTeam = async(handler) => {/*
        let response= await Axios.get('http://localhost:3001/api/v1/team/'+params.id,{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
            handler(response.data);
            */
           handler({
            _id: "62927ddbc8a1c137d5e6cc23",
            category: "Super22",
            players: "[62927a8fc8a1c137d5e6cbf6,62927a8fc8a1c137d5e6cgb4]",
            coach: "629272f3c8a1c137d5e6ca6c",
            tm: "62927232c8a1c137d5e6ca4f",
            status: 0,
            hidden: 0,
            added_by: "629096428ac032433daba53e",
            created_at: "2022-05-22T19:12:13.819Z",
            __v: 0
          })
        };

    const getUsers = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/user',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        handler(response.data);
    }


    
    

    const [players,setPlayersList]=useState([]);

    const [componentiList,setComponentiList]=useState([]);   
    const[tesseratiNoSquadra,setTesseratiNoSquadra]=useState([]);
    
    const[categoria,setCategoria]=useState("");
    const [componentiChecked,setComponentiChecked]=useState([]);
    const [noSquadChecked,setNoSquadChecked]=useState([]);

    var coach="";
    var teamManager="";

    const salva=()=>{
        console.log(categoria+" "+coach+" "+teamManager);
        console.log(componentiChecked);
        console.log(noSquadChecked);
        /*
        Axios.post('http://localhost:3001/',{
           //TODO api modifica squadra
        });
        */
    };
    
    useEffect(()=>{
        var temp=[];
        if(sessionStorage.getItem('loggedIn')==false){
            window.location.href="/login";
        }else{
            if(squadra.length==0){
                getTeam(setSquadra);
            }else{
                var temp=squadra.players
                temp=temp.replace("[","[\"");
                temp=temp.replace("]","\"]");
                temp=temp.replace(",","\",\"");
                console.log(temp)
                
                setPlayersList(JSON.parse(temp));
            }
            if(tesseratiList.length==0){
                getUsers(setTesseratiList);
            }else{
                for(var i=0;i<tesseratiList.length;i++){
                    switch(tesseratiList[i].a_type){
                        case 0: //ga
                            if(players.includes(tesseratiList[i]._id)){
                                componentiList.push(tesseratiList[i])
                            }else{
                                tesseratiNoSquadra.push(tesseratiList[i])
                            }
                            
                            break;
                        case 2: //tm
                            tms.push({ value: tesseratiList[i]._id, label: tesseratiList[i].name+" "+tesseratiList[i].surname });
                            break;
                        case 3: //ch
                            coaches.push({ value: tesseratiList[i]._id, label: tesseratiList[i].name+" "+tesseratiList[i].surname });
                            break;
                    }
                }
                setGas(temp); 
            }
        }

        setCategoria(squadra.category);
        document.getElementById('categoria').value = squadra.category;

        teamManager =squadra.tm;
        document.getElementById('teamM').value = { value: squadra.tm, label: "asd"};

        coach =squadra.ch;
        document.getElementById('coach').value = squadra.coach;

        console.log(squadra)
        console.log(tesseratiList)
    },[tesseratiList]);


    const customStyles = {
        option: (provided, state) => ({
        ...provided,
        borderBottom: '2px dotted orange',
        padding: 20,
        }),
        control: () => ({
        // none of react-select's styles are passed to <Control />
        
        }),
        singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
        }
    }

    /*stuff to handle selectors*/
    const handleChange = (selector, event) => {
        if (selector === "teamManager") {
          teamManager=event.value;
        } else if (selector === "coach") {
          coach= event.value;
        }
      };

    const handleCheckBoxComponenti= (key,event) => {
        if(componentiChecked.includes(componentiList[key]._id)){
            setComponentiChecked(arrayRemove(componentiChecked, componentiList[key]._id));
        }else{
            componentiChecked.push(componentiList[key]._id);
        }
    };

    const handleCheckBoxNoSquadra= (key,event) => {
        if(noSquadChecked.includes(tesseratiNoSquadra[key]._id)){
            setNoSquadChecked(arrayRemove(noSquadChecked, tesseratiNoSquadra[key]._id));
        }else{
            noSquadChecked.push(tesseratiNoSquadra[key]._id);
        }

    };

    function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    const handleChangeInputText = (event) => {
        switch(event.target.id){
            case "categoria":
                setCategoria(event.target.value);
                break;
        }
    }

    return (
        <div className="ModificaSquadra">
              <Sidebar />
            <div>
                <Topbar /> 
                <div className='title'>
                    <h1>Modifica Squadra</h1>
                    <div className="btnContainer"><button id="btn" onClick={salva}>Salva</button></div>
                </div>
                    <InputText type={"text"} label={"Categoria"} id={"categoria"} onChangeHeadline={handleChangeInputText} />
                <div className='selectors'>
                    <div>       
                        <label>Coach</label>
                        <div className='chInput'>        
                            <Select id="coach" styles={customStyles} 
                            options={coaches} 
                            placeholder={" "} 
                            onChange={event => handleChange("coach", event)
                        } />
                        </div>
                    </div> 
                    <div>  
                        <label>Team Manager</label>
                        <div className='tmInput'>        
                            <Select id="teamM" 
                            styles={customStyles} 
                            options={tms} 
                            placeholder={" "} 
                            onChange={event => handleChange("teamManager", event)
                        } />
                        </div>
                    </div> 
                </div> 
                <h1 id="table_title">Componenti:</h1>
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {componentiList.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td><h1><Checkbox
                                    defaultChecked
                                    onChange={event =>handleCheckBoxComponenti(key,event)} />
                                </h1></td> <td><h2>{val.name} {val.surname}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
                <h1 id="table_title">Tesserati senza squadra:</h1>
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {tesseratiNoSquadra.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td><h1><Checkbox
                                    onChange={event =>handleCheckBoxNoSquadra(key,event)} />
                                </h1></td> <td><h2>{val.name} {val.surname}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>         
        </div>
        
    );
}

export default ModificaSquadra;