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




const CreaSquadra = ()=>{

    const [tesseratiList,settesseratiList]=useState([]);
    const [coaches,setCoaches]=useState([]);
    const [tms,setTms]=useState([]);
    const [gas,setGas]=useState([]);

    const fetchData = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/user',{
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
                for(var i=0;i<tesseratiList.length;i++){
                    switch(tesseratiList[i].a_type){
                        case 0: //ga
                            temp.push(tesseratiList[i]);
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
    },[tesseratiList]);

    const[categoria,setCategoria]=useState("");
    const [checked,setchecked]=useState([]);
    var coach="";
    var teamManager="";

    const salva=()=>{
        Axios.post('http://localhost:3001/api/v1/team',{
                category: categoria,
                players: JSON.stringify(checked),
                coach:coach,
                tm:teamManager,
                added_by:sessionStorage.getItem("user_id")},
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            window.alert("Squadra inserita correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })
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
                                <td><h1><Checkbox
                                    onChange={event =>handleCheckBox(val._id,event)} />
                                </h1></td> <td><h2>{val.name}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.street},{val.city}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>         
        </div>
        
    );
}

export default CreaSquadra;