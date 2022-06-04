import React, { useEffect,useState } from 'react';
import Axios from 'axios';

/* Components */
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import InputText from '../components/InputText';
import { Checkbox } from '@mui/material';

/*Style*/
import "./NuovoEvento.css"

const NuovoEvento = ()=>{

    const[titolo,setTitolo]=useState("");
    const[descrizione,setDescrizione]=useState("");
    const[data,setData]=useState("");
    const[type,setType]=useState("");
    const[teams,setTeams]=useState([]);

    const[typeOptions,setTypeOptions]=useState([]);


    const getEventType = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v2/eventtype',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        var temp=[]
        response.data.forEach(element => {
            temp.push({value:element._id, label:element.name})
        });
        handler(temp);
    }

    useEffect(()=>{
        getEventType(setTypeOptions)
    },[]);


    const getTeams = async(handler) => {
        let response= await Axios.get('http://localhost:3001/api/v1/team',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })
        handler(response.data);
    }

    useEffect(()=>{
        getTeams(setTeams)
    },[]);


    const salva=()=>{
        console.log(titolo+" "+descrizione+" "+data+" "+type+" "+checked)
        
        Axios.post('http://localhost:3001/api/v2/event',{
                title: titolo,
                description: descrizione,
                date: data,
                e_type: type,
                teams:[], 
                added_by:sessionStorage.getItem("user_id")},
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            window.alert("Evento inserito correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
            document.getElementById("tipo").value="";  
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

    const handleChange = (event) => {
        setType(event.value);
      };

      const handleChangeInputText = (event) => {
        switch(event.target.id){
            case "titolo":
                setTitolo(event.target.value);
                break;
            case "descrizione":
                setDescrizione(event.target.value);
                break; 
            case "data":
                setData(event.target.value);
                break;  
        }
    };

    const [checked,setchecked]=useState([]);
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

    return (
        <div className="nuovoEvento">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Nuovo Evento</h1>
                    <div className="btnContainer"><button id="salvaBtn" onClick={salva}>Salva Evento</button></div>
                </div> 
                <div>
                    <InputText type={"datetime-local"} label={"Data"} id={"data"} onChangeHeadline={handleChangeInputText} />
                    <InputText type={"text"} label={"Titolo"} id={"titolo"} onChangeHeadline={handleChangeInputText} />
                    <InputText type={"text"} label={"Descrizione"} id={"descrizione"} onChangeHeadline={handleChangeInputText} />
                    <label>Tipo</label>
                    <div className='tipoInput'>        
                        <Select id="tipo" 
                            styles={customStyles} 
                            options={typeOptions} 
                            placeholder={" "} 
                            onChange={event => handleChange(event)
                            } 
                        />
                    </div>
                </div>
                <table cellSpacing ="0" className='teamList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Categoria</h1></td> </tr>
                    {teams.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td id="checbox_td"><Checkbox
                                    onChange={event =>handleCheckBox(val._id,event)} />
                                </td> 
                                <td><h2>{val.category}</h2></td> {" "}
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
        
    );
}

export default NuovoEvento;