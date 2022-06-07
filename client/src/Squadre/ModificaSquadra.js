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
    const [tms,setTMs]=useState([]);
    
    const [tm_idSelected,setTM_idSelected]=useState("");


    const [chs,setCHs]=useState([]);

    const [ch_idSelected,setCH_idSelected]=useState("");


    const [componentiList,setComponentiList]=useState([]);

    const [squadra,setSquadra]=useState([]);
    const [tesseratiList,settesseratiList]=useState([]);

    const [categoria,setCategoria]=useState("");

    const params=useParams();

    const[tesseratiNoSquadra,setTesseratiNoSquadra]=useState([]);
    
    const [checked,setChecked]=useState([]);
    const [unchecked,setUnchecked]=useState([]);
    

    const getSquadra = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v1/team/'+params.id,{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
         handler(response.data)   
        };

    useEffect(()=>{
            if(squadra.length==0){
                getSquadra(setSquadra);
            }
    

        if(sessionStorage.getItem('user_a_type')!="1"){
        window.location.href="/home";
        }
        
        
    },[squadra]);

    const getTesserati = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v1/user',{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            });
            //settesseratiList(response.data);
            handler(response.data);    
    }

    useEffect(()=>{
        
        if(tesseratiList.length==0){
            getTesserati(settesseratiList);
        }
        else{
            tesseratiList.forEach(element => {
                if(element.team_id==params.id){
                    checked.push(element._id)
                    componentiList.push(element)
                    /*
                    switch(element.a_type.type){
                        case 0: //ga
                            componentiList.push(element)
                            
                            break;
                        case 2://tm
                            tms.push({value:element._id,label:element.name+" "+element.surname});
                            setTM_idSelected(element._id);
                            break;
                        case 3://ch
                            chs.push({value:element._id,label:element.name+" "+element.surname});
                            setCH_idSelected(element._id);
                            break;
                    }
                    */
                }else{
                    if(element.a_type.type!=1){
                        unchecked.push(element._id)
                        tesseratiNoSquadra.push(element)
                    }
                    
                    /*
                    switch(element.a_type.type){
                        case 0://ga
                            unchecked.push(element._id)
                            tesseratiNoSquadra.push(element)
                            break;
                        case 2://tm
                            unchecked.push(element._id)

                            tms.push({value:element._id,label:element.name+" "+element.surname});
                            break;
                        case 3://ch
                            unchecked.push(element._id)
                            chs.push({value:element._id,label:element.name+" "+element.surname});
                            break;
                    }
                    */
                }                       
            });
        }

        setCategoria(squadra.category);
        document.getElementById('categoria').value = squadra.category;

        //TODO settare valori dei selector

    },[tesseratiList]);

    const salva=()=>{
        /*
        if(categoria!=squadra.category){
            Axios.patch(process.env.URL+'/api/v1/team/'+params.id,{
                category:categoria
            },
            {headers:{
                "auth-token":sessionStorage.getItem('token')}
            }).then((response)=>{
                //window.alert("Squadra correttamente");
            }).catch((error)=>{
                console.log(error.response.data)
                window.alert(error.response.data);
            })
        }

    checked.forEach(element => {
        Axios.patch(process.env.URL+'/api/v1/user/'+element,{
            team_id:params.id
        },
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            //window.alert("Profilo modificato correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })
    });

    unchecked.forEach(element => {
        Axios.patch(process.env.URL+'/api/v1/user/'+element,{
            team_id:"000000000000000000000000"
        },
        {headers:{
            "auth-token":sessionStorage.getItem('token')}
        }).then((response)=>{
            //window.alert("Profilo modificato correttamente");
        }).catch((error)=>{
            console.log(error.response.data)
            window.alert(error.response.data);
        })
    })
    */
    window.location.href="/squadra/"+params.id
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
            console.log(event.value)
            console.log(tm_idSelected)

            if(tm_idSelected!=event.value){
                flipflopchecks(event.value);
                flipflopchecks(tm_idSelected);
                setTM_idSelected(event.value)
            }
        } else if (selector === "coach") {
            if(ch_idSelected!=event.value){
                flipflopchecks(event.value);
                flipflopchecks(ch_idSelected);
                setCH_idSelected(event.value)
            }
        }
      };

    const handleCheckBoxComponenti= (key,event) => {
        flipflopchecks(componentiList[key]._id);
    };

    const handleCheckBoxNoSquadra= (key,event) => {
        flipflopchecks(tesseratiNoSquadra[key]._id);
    };

    const flipflopchecks= (id) => { //TODO mettere apposto
        if(checked.includes(id)){
            console.log("removed");
            setUnchecked([...unchecked,id]);
            setChecked(arrayRemove(checked,id));
            
        }else{
            console.log("add")
            setChecked([...checked,id]);
            setUnchecked(arrayRemove(unchecked,id));
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
                <div className='selectors' style={{"display":"none"}}>
                    <div>       
                        <label>Coach</label>
                        <div className='chInput'>        
                            <Select id="coach" styles={customStyles} 
                            options={chs} 
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
                <h1 id="table_title" style={{"font-size":"22px"}}>Componenti:</h1>
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {componentiList.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td style={{width:"2%"}}><h1><Checkbox
                                    defaultChecked
                                    onChange={event =>handleCheckBoxComponenti(key,event)} />
                                </h1></td> <td><h2>{val.name} {val.surname}</h2></td> <td><h2>{(val.birth).split("T")[0]}</h2></td> <td><h2>{val.street} {val.city}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
                <h1 id="table_title" style={{"font-size":"22px"}}>Tesserati senza squadra:</h1>
                <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Data nascita</h1></td><td><h1>Indirizzo</h1></td><td><h1>Iscirizione</h1></td></tr>
                    {tesseratiNoSquadra.map((val,key) => {
                        return( 
                            <tr id="row">
                                {" "}
                                <td style={{width:"2%"}}><h1><Checkbox
                                    onChange={event =>handleCheckBoxNoSquadra(key,event)} />
                                </h1></td> <td><h2>{val.name} {val.surname}</h2></td> <td><h2>{(val.birth).split("T")[0]}</h2></td> <td><h2>{val.street} {val.city}</h2></td> <td><h2>{val.iscritto}</h2></td>{" "}
                            </tr>
                        );
                    })}
                </table>
            </div>         
        </div>
        
    );
}

export default ModificaSquadra;