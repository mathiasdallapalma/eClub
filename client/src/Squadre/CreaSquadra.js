import { Checkbox } from '@mui/material';
import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


/* Components */
import InputText from '../components/InputText';
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./CreaSquadra.css"
import axios from 'axios';




const CreaSquadra = ()=>{

    const [tesseratiList,settesseratiList]=useState([]);
    const [coaches,setCoaches]=useState([]);
    const [tms,setTms]=useState([]);
    const [gas,setGas]=useState([]);

    const fetchData = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v1/user',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        handler(response.data);
    }

    useEffect(()=>{
        var temp=[];
        if(sessionStorage.getItem('loggedIn')==false){
            window.location.href="/login";
        }else{
            if(tesseratiList.length==0){
                fetchData(settesseratiList);  
            } else{
                tesseratiList.forEach(element => {
                    if(element.team_id=="000000000000000000000000")
                    switch(element.a_type.type){
                        case 0: //ga
                            temp.push(element);
                            break;
                        case 2: //tm
                            tms.push({ value: element._id, label: element.name+" "+element.surname });
                            break;
                        case 3: //ch
                            coaches.push({ value: element._id, label: element.name+" "+element.surname });
                            break;
                    }
                });
                setGas(temp); 
            }
        }
    },[tesseratiList]);

    const[categoria,setCategoria]=useState("");
    const [checked,setchecked]=useState([]);
    var coach="";
    var teamManager="";

    const salva=()=>{

        var temp=[];
        if(teamManager!=""){
            temp.push(teamManager);
        }else{
            window.alert("TeamManager non selezionato")
        }

        if(coach!=""){
            temp.push(coach);
        }else{
            window.alert("Coach non selezionato")
        }
        temp=temp.concat(checked);
        var newTeam_id;
        
        Axios.post(process.env.URL+'/api/v1/team',{
                category: categoria,
                added_by:sessionStorage.getItem("user_id")},
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            newTeam_id= response.data.team
            
            temp.forEach(element => {
            Axios.patch("http://localhost:3001/api/v1/user/"+element,{
                        team_id: newTeam_id,
                },
                {headers:{
                    "auth-token":sessionStorage.getItem('token')}
                }).catch((error)=>{
                    console.log(error.response.data)
                    window.alert(error.response.data);
                })
            });
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })

       window.location.href="/squadre" 

    };

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

    const handleCheckBox = (id,event) => {
        if(checked.includes(id)){
            setchecked(arrayRemove(checked, id));
        }else{
            checked.push(id);
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
        <div className="CreaSquadra">
              <Sidebar />
            <div>
                <Topbar /> 
                <div className='title'>
                    <h1>Creazione Squadra</h1>
                    <div className="btnContainer"><button id="salvaBtn" onClick={salva}>Salva Squadra</button></div>
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
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {gas.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td id="checbox_td"><Checkbox
                                    onChange={event =>handleCheckBox(val._id,event)} />
                                </td> 
                                <td><h2>{val.name} {val.surname}</h2></td> <td><h2>{(val.birth).split('T')[0]}</h2></td> <td><h2>{val.street} {val.city}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>         
        </div>
        
    );
}

export default CreaSquadra;