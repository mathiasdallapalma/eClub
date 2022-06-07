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



const ModificaProfilo = ()=>{
    const[nome,setNome]=useState("");
    const[cognome,setCognome]=useState("");
    const[dataNascita,setDataNascita]=useState("");
    const[telefono,setTelefono]=useState("");
    const[comune,setComune]=useState([]);
    const[via,setVia]=useState([]);
    const[provincia,setProvincia]=useState([]);
    const[nazione,setNazione]=useState([]);
    const[zip,setZip]=useState([]);
    const[tipo,setTipo]=useState([]);

    const[ruoliOptions,setRuoliOptions]=useState([]);

    const user=JSON.parse(sessionStorage.getItem("user_toModify"))

    const salva=()=>{
        Axios.patch(process.env.URL+'/api/v1/user/'+user._id,{
                name: nome,
                surname: cognome,
                password: "1234567",
                zip:zip,
                birth:dataNascita,
                city:comune,
                province:provincia,
                nation:nazione,
                street:via,
                phone:telefono,
                added_by:sessionStorage.getItem("user_id")},
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            window.alert("Profilo modificato correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })
    };

    useEffect(()=>{     

        setNome(user.name);
        document.getElementById('nome').value = user.name;

        setCognome(user.surname);
        document.getElementById('cognome').value = user.surname;

        setDataNascita(user.birth.split("T")[0]);
        document.getElementById('data_nascita').value = user.birth.split("T")[0];

        setTelefono(user.phone);
        document.getElementById('telefono').value = user.phone;

        setComune(user.city);
        document.getElementById('comune').value = user.city;

        setVia(user.street);
        document.getElementById('via').value = user.street;

        setProvincia(user.province);
        document.getElementById('provincia').value = user.province;

        setNazione(user.nation);
        document.getElementById('nazione').value = user.nation;

        setZip(user.zip);
        document.getElementById('zip').value = user.zip;


        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga
                document.getElementById("anagrafic").style.display="none";
                document.getElementById("indirizzo").style.display="none";
                break;
            case "1": //dd
                
                break;
            case "2": //tm
                document.getElementById("anagrafic").style.display="none";
                document.getElementById("indirizzo").style.display="none";
                break;
            case"3":
                document.getElementById("anagrafic").style.display="none";
                document.getElementById("indirizzo").style.display="none";
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
                    </tr>
                </table>           
            </div>   
        </div>
        
    );
}

export default ModificaProfilo;