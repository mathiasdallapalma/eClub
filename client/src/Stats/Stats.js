import React, { useEffect,useReducer,useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Checkbox } from '@mui/material';

/* Components*/
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/*Style*/
import "./Stats.css"

/*Icons*/
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../components/InputText';

const Stats = ()=>{
    
    const [user,setUser]=useState(0);

    useEffect(()=>{
        setUser(JSON.parse(sessionStorage.getItem("user")));

        switch(sessionStorage.getItem('user_a_type')){
            case "0": //ga

                break;
            case "1": //dd
                
                break;
            case "2": //tm

                break;
            case"3": //ch

                break;
        }
    },[]);

    const [evaluations,setEvaluations]=useState([]);
    const [attendances,setAttendances]=useState([]);

    useEffect(()=>{
        if(evaluations.length==0){
            getEvaluations(setEvaluations)
        }
    },[evaluations]);

    const getEvaluations = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v2/evaluation',{
            headers:{
                "auth-token":sessionStorage.getItem('token')}
            })
        
        handler(response.data);
    }

    useEffect(()=>{
        
        if(attendances.length==0){
            getAttendances(setAttendances)
        }
        console.log(attendances)
        
    },[attendances]);

    const getAttendances = async(handler) => {
        let response= await Axios.get(process.env.URL+'/api/v2/attendance',{
        headers:{
            "auth-token":sessionStorage.getItem('token')}
        })

        handler(response.data)
        
    }

    const handleCheckBoxAttendance = (id,event) => {
        if(sessionStorage.getItem('user_a_type')=="2"){
            var found = attendances.find(function (element) {
                return element._id ==id;
            });
            if(found.value==false){
                Axios.patch("http://localhost:3001/api/v2/attendance/"+id,{
                    value: true,
                },
                {headers:{
                    "auth-token":sessionStorage.getItem('token')}
                }).catch((error)=>{
                    console.log(error.response.data)
                    window.alert(error.response.data);
                })
                found.value=true
            }else{
                Axios.patch("http://localhost:3001/api/v2/attendance/"+id,{
                    value: false,
                },
                {headers:{
                    "auth-token":sessionStorage.getItem('token')}
                }).catch((error)=>{
                    console.log(error.response.data)
                    window.alert(error.response.data);
                })
                found.value=false
            }
        }
    };

    const handleCheckBoxEvaluations = (id,event) => {
        if(sessionStorage.getItem('user_a_type')=="2"){
            var newVal=parseInt(event.target.value);
            if(newVal>0&&newVal<=10){
                var found = attendances.find(function (element) {
                    return element._id ==id;
                });
                Axios.patch("http://localhost:3001/api/v2/evaluation/"+id,{
                    value: newVal,
                },
                {headers:{
                    "auth-token":sessionStorage.getItem('token')}
                }).catch((error)=>{
                    console.log(error.response.data)
                    window.alert(error.response.data);
                })
                
            }
        }

    };
    
                        
 
    return (
        <div className="evento">
            <Sidebar />
            <div>
                <Topbar />
                <div className='title'>
                    <h1>Statistiche</h1>
                </div> 
                <div id='attendance'>
                    <h1> Presenze </h1>
                    <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Evento</h1></td></tr>
                    {attendances.map((val,key) => {
                        var dateString=(val.event.date).replace("T"," ");
                        dateString=dateString.replace(":00.000Z","");
                        return( 
                            <tr id="row">
                                {" "}
                                <td id="checbox_td"><Checkbox
                                    defaultChecked={val.value}
                                    onChange={event =>handleCheckBoxAttendance(val._id,event)} />
                                </td> 
                                <td style={{width:"20%"}}><h2>{val.player.name} {val.player.surname}</h2></td> <td><h2>{val.event.title} {dateString}</h2> </td> {" "}
                            </tr>
                        );
                    })}
                    </table>
                </div>
                <div id='evaluations'>
                    <h1> Valutazioni </h1>
                    <table cellSpacing ="0" className='tesseratiList'>
                    <tr id="header"> <td><h1></h1></td> <td><h1>Nome</h1></td> <td><h1>Evento</h1></td></tr>
                    {evaluations.map((val,key) => {
                        var dateString=(val.event.date).replace("T"," ");
                        dateString=dateString.replace(":00.000Z","");
                        return( 
                            <tr id="row">
                                {" "}
                                <td id="checbox_td"style={{width:"2%"}}>
                                    <InputText
                                    defaultValue={val.value}
                                    onChangeHeadline={event =>handleCheckBoxEvaluations(val._id,event)}
                                    />
                                </td> 
                                <td style={{width:"20%"}}><h2>{val.player.name} {val.player.surname}</h2></td> <td><h2>{val.event.title} {dateString}</h2> </td> {" "}
                            </tr>
                        );
                    })}
                    </table>
                </div>
            </div> 
        </div>   
    );
}

export default Stats;