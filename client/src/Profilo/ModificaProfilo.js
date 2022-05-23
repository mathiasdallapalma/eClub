import { Checkbox } from '@mui/material';
import Axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/* Components */
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import InputText from '../components/InputText';
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./ModificaProfilo.css"
import session from '../index.js'


const ModificaProfilo = ()=>{
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
    const[tipo,setTipo]=useState([]);

    const utente={
        nome:"nome",
        cognome:"cognome",
        dataNascita:"2000-01-01",
        telefono:"telefono",
        email:"email",
        comune:"comune",
        via:"via",
        provincia:"provincia",
        nazione:"nazione",
        zip:"zip",
        ruolo:"ga"
    }

    const[ruoliOptions,setRuoliOptions]=useState([]);

    const salva=()=>{
        console.log(nome+" "+cognome+" "+dataNascita+" "+telefono+" "+email+" "+tipo+" z:"+zip+" v:"+via+" c:"+comune+" n:"+nazione+" p:"+provincia)
        /*
        Axios.post('http://localhost:3001/',{
           TODO api salva modifiche
        });
        */
    };

    useEffect(()=>{
              
        ruoliOptions.push({ value: 'tm', label: 'TeamManager' });
        ruoliOptions.push({ value: 'ch', label: 'Coach' });
        ruoliOptions.push({ value: 'ga', label: 'Genitore/Atleta' });

        setNome(utente.nome);
        document.getElementById('nome').value = utente.nome;

        setCognome(utente.cognome);
        document.getElementById('cognome').value = utente.cognome;

        setDataNascita(utente.dataNascita);
        document.getElementById('data_nascita').value = utente.dataNascita;

        setTelefono(utente.telefono);
        document.getElementById('telefono').value = utente.telefono;

        setEmail(utente.email);
        document.getElementById('email').value = utente.email;

        setComune(utente.comune);
        document.getElementById('comune').value = utente.comune;

        setVia(utente.via);
        document.getElementById('via').value = utente.via;

        setProvincia(utente.provincia);
        document.getElementById('provincia').value = utente.provincia;

        setNazione(utente.nazione);
        document.getElementById('nazione').value = utente.nazione;

        setZip(utente.zip);
        document.getElementById('zip').value = utente.zip;

        setTipo(utente.tipo);
        document.getElementById('ruolo').value = utente.tipo; // TODO Non funziona bene 

        


        switch(session.utente.tipo){
            case "0": //ga
                document.getElementById("anagrafic").style.display="none";
                document.getElementById("indirizzo").style.display="none";
                document.getElementById("tipo").style.display="none";
                break;
            case "1": //dd
                
                break;
            case "2": //tm
                document.getElementById("anagrafic").style.display="none";
                document.getElementById("indirizzo").style.display="none";
                document.getElementById("tipo").style.display="none";
                break;
            case"3":
                document.getElementById("anagrafic").style.display="none";
                document.getElementById("indirizzo").style.display="none";
                document.getElementById("tipo").style.display="none";
                break;
        }
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
        setTipo(event.value);
      };

    const handleChangeInputText = (event) => {
        console.log(event.target.value);
        console.log(event.target.id);

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
        <div className="ModificaProfilo">
              <Sidebar />
            <div>
                <Topbar /> 
                <div className='title'>
                    <h1>Modifica Profilo</h1>
                    <div className="btnContainer"><button id="btn" onClick={salva}>Salva</button></div>
                </div>  
                <table>
                    <tr id="anagrafic">
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
                    <tr id="indirizzo">
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
                    <tr id="tipo">
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

export default ModificaProfilo;