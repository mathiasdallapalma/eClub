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
    const [coachNames,setcoachNames]=useState([]);
    const [teamMNames,setteamMNames]=useState([]);
    const [tesseratiList,settesseratiList]=useState([]);

    coachNames.push({ value: 'blue', label: 'Blue' });
    coachNames.push({ value: 'red', label: 'Red' });
    teamMNames.push({ value: 'green', label: 'Green' });
    teamMNames.push({ value: 'yellow', label: 'Yellow' });
    tesseratiList.push({
        name: "Giorgio Vanni",
        birth: "01/01/2000",
        address: "CASA",
        iscritto: "iscrizione effettuata"
    });

    const[categoria,setCategoria]=useState("");
    const [checked,setchecked]=useState([]);
    var coach="";
    var teamManager="";

    const salva=()=>{
        
        console.log(categoria+" "+coach+" "+teamManager);
        console.log(checked);
        /*
        Axios.post('http://localhost:3001/',{
           //TODO api inserisci squadra
        });
        */
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
        } else {
          // Other logic
        }
        // Here you trigger whatever you want
      };

    const handleCheckBox = (key,event) => {
        if(checked.includes(key)){
            setchecked(arrayRemove(checked, key));
        }else{
            checked.push(key);
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
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {tesseratiList.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td><h1><Checkbox
                                    onChange={event =>handleCheckBox(key,event)} />
                                </h1></td> <td><h2>{val.name}</h2></td> <td><h2>{val.birth}</h2></td> <td><h2>{val.address}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>         
        </div>
        
    );
}

export default CreaSquadra;