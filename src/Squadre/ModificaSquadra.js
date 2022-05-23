import { Checkbox } from '@mui/material';
import Axios  from 'axios';
import React, { useEffect, useState } from 'react';


/* Components */
import InputText from '../components/InputText';
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./ModificaSquadra.css"




const ModificaSquadra = ()=>{
    const [coachNames,setcoachNames]=useState([]);
    const [teamMNames,setteamMNames]=useState([]);

    //const [squadra,setSquadra]=useState([]);

    var squadra={
        id:"id",
        categoria:"Categoria",
        tm:"Yellow",
        ch:"Red"
    }

    const [componentiSquadra,settesseratiList]=useState([]);    
    const[tesseratiNoSquadra,setTesseratiNoSquadra]=useState([]);
    
    const[categoria,setCategoria]=useState("");
    const [componentiChecked,setChecked]=useState([]);
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
        coachNames.push({ value: 'blue', label: 'Blue' });
        coachNames.push({ value: 'red', label: 'Red' });
        teamMNames.push({ value: 'green', label: 'Green' });
        teamMNames.push({ value: 'yellow', label: 'Yellow' });

        componentiChecked[0]="giorgi";

        setCategoria(squadra.categoria);
        document.getElementById('categoria').value = squadra.categoria;

        teamManager =squadra.tm;
        document.getElementById('teamM').value = squadra.tm;

        coach =squadra.ch;
        document.getElementById('coach').value = squadra.ch;
    },[]);

    tesseratiNoSquadra.push({
        id:"giorgi",
        name: "Giorgio Vanni",
        birth: "01/01/2000",
        address: "CASA",
        iscritto: "iscrizione effettuata"
    });

    tesseratiNoSquadra.push({
        id:"ns",
        name: "No squadra",
        birth: "01/01/2000",
        address: "CASA",
        iscritto: "iscrizione effettuata"
    });

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
        if(componentiChecked.includes(componentiSquadra[key].id)){
            setChecked(arrayRemove(componentiChecked, componentiSquadra[key].id));
        }else{
            componentiChecked.push(componentiSquadra[key].id);
        }
    };

    const handleCheckBoxNoSquadra= (key,event) => {
        if(noSquadChecked.includes(tesseratiNoSquadra[key].id)){
            setNoSquadChecked(arrayRemove(noSquadChecked, tesseratiNoSquadra[key].id));
        }else{
            noSquadChecked.push(tesseratiNoSquadra[key].id);
        }

    };

    function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    const handleChangeInputText = (event) => {
        console.log(event.target.value);
        console.log(event.target.id);

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
                            options={coachNames} 
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
                            options={teamMNames} 
                            placeholder={" "} 
                            onChange={event => handleChange("teamManager", event)
                        } />
                        </div>
                    </div> 
                </div> 
                <h1 id="table_title">Componenti:</h1>
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {componentiSquadra.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td><h1><Checkbox
                                    defaultChecked
                                    onChange={event =>handleCheckBoxComponenti(key,event)} />
                                </h1></td> <td><h2>{val.name}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
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
                                </h1></td> <td><h2>{val.name}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>         
        </div>
        
    );
}

export default ModificaSquadra;