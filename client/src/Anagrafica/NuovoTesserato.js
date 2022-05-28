import { Checkbox } from '@mui/material';
import Axios  from 'axios';
import React, { useEffect, useState } from 'react';

/* Components */
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import InputText from '../components/InputText';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./NuovoTesserato.css"
import axios from 'axios';


const NuovoTesserato = ()=>{
    const[nome,setNome]=useState("");
    const[cognome,setCognome]=useState("");
    const[dataNascita,setDataNascita]=useState("");
    
    const[telefono,setTelefono]=useState("");
    const[email,setEmail]=useState("");
    const[comune,setComune]=useState([]);
    const[via,setVia]=useState([]);
    const[provincia,setProvincia]=useState([]);
    const[nazione,setNazione]=useState([]);
    const[zip,setZip]=useState([]);
    var tipo;

    const[ruoliOptions,setRuoliOptions]=useState([]);

    const salva=()=>{
        Axios.post('http://localhost:3001/api/v1/user',{
                email: email,
                name: nome,
                surname: cognome,
                password: "1234567",
                a_type:tipo,
                zip:zip,
                city:comune,
                province:provincia,
                nation:nazione,
                street:via,
                phone:telefono,
                added_by:sessionStorage.getItem("user_id")},
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            window.alert("Tesserato inserito correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })
    };

    useEffect(()=>{
        ruoliOptions.push({ value: '2', label: 'TeamManager' });
        ruoliOptions.push({ value: '3', label: 'Coach' });
        ruoliOptions.push({ value: '0', label: 'Genitore/Atleta' });
        /*Axios.get('http://localhost:3001/squadre').then((response)=>{
            setSquadreList(response.data);
        })*/
    },[]);

   

    

   

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

    const handleChange = (event) => {
        tipo=event.value;
      };

    const handleChangeInputText = (event) => {
        switch(event.target.id){
            case "nome":
                setNome(event.target.value);
                break;
            case "cognome":
                setCognome(event.target.value);
                break;
            case "zip":
                setZip(event.target.value);
            break;
            case "comune":
                setComune(event.target.value);
            break;
            case "via":
                setVia(event.target.value);
            break;
            case "provincia":
                setProvincia(event.target.value);
            break;
            case "nazione":
                setNazione(event.target.value);
            break;
            case "data_nascita":
                setDataNascita(event.target.value);
                break;
            case "telefono":
                setTelefono(event.target.value);
                break;
            case "email":
                setEmail(event.target.value);
            break;
        }
    };


    

    return (
        <div className="NuovoTesserato">
              <Sidebar />
            <div>
                <Topbar /> 
                <div className='title'>
                    <h1>Nuovo Tesserato</h1>
                    <div className="btnContainer"><button id="salvaBtn" onClick={salva}>Salva Tesserato</button></div>
                </div>  
                <table>
                    <tr>
                        <td colSpan={2}>
                            <InputText type={"text"} label={"Nome"} id={"nome"} onChangeHeadline={handleChangeInputText} />
                        </td>
                        <td colSpan={2}>
                            <InputText type={"text"} label={"Cognome"} id={"cognome"} onChangeHeadline={handleChangeInputText} />
                        </td> 
                        <td colSpan={2}>
                            <InputText type={"date"} label={"Data di nascita"} id={"data_nascita"} onChangeHeadline={handleChangeInputText} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5} >
                            <div style={{"display":"flex","flex-direction": "row "}}>
                                <InputText type={"text"} label={"Via, n°"} id={"via"} onChangeHeadline={handleChangeInputText} />
                                <InputText type={"text"} label={"CAP"} id={"zip"} onChangeHeadline={handleChangeInputText} />
                                <InputText type={"text"} label={"Provincia"} id={"provincia"} onChangeHeadline={handleChangeInputText} />
                                <InputText type={"text"} label={"Comune"} id={"comune"} onChangeHeadline={handleChangeInputText} />
                                <InputText type={"text"} label={"Nazione"} id={"nazione"} onChangeHeadline={handleChangeInputText} />
                            </div>
                        </td>
                    
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <InputText type={"text"} label={"Telefono"} id={"telefono"} onChangeHeadline={handleChangeInputText} />
                        </td>
                        <td colSpan={2}>
                            <InputText type={"text"} label={"Email"} id={"email"} onChangeHeadline={handleChangeInputText} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                        <label>Ruolo</label>
                        <div className='ruoloInput'>        
                            <Select id="ruolo" 
                                styles={customStyles} 
                                options={ruoliOptions} 
                                placeholder={" "} 
                                onChange={event => handleChange(event)
                                        } 
                            />
                        </div>
                        </td>
                    </tr>
                </table>           
            </div>   
        </div>
        
    );
}

export default NuovoTesserato;