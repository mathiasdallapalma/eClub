import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import PaymentsIcon from '@mui/icons-material/Payments';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactMailIcon from '@mui/icons-material/ContactMail';

import session from '../index.js';

console.log(session)


const SidebarData=[
    {
        title:"Dashboard",
        icon:<DashboardIcon />,
        link:"/home",
        id:"home"
    },
    {
        title:"Squadra",
        icon:<GroupsIcon />,
        link:"/squadre/",
        id:"squadra"
    },
    {
        title:"Squadre",
        icon:<GroupsIcon />,
        link:"/squadre",
        id:"squadre"
    },
    {
        title:"Anagrafica",
        icon:<ContactMailIcon />,
        link:"/anagrafica",
        id:"anagrafica"
    },
    {
        title:"Pagamenti",
        icon:<PaymentsIcon />,
        link:"/pagamenti",
        id:"pagamenti"
    },
    {
        title:"Visite Mediche",
        icon:<MedicalInformationIcon />,
        link:"/meds",
        id:"meds"
    },
    {
        title:"Materiale",
        icon:<FitnessCenterIcon />,
        link:"/materiale",
        id:"materiale"
    },
    {
        title:"Valutazioni/Presenze",
        icon:<MilitaryTechIcon />,
        link:"/stats",
        id:"stats"
    },
    {
        title:"Eventi",
        icon:<CalendarTodayIcon />,
        link:"/eventi",
        id:"eventi"
    },
    {
        title:"Logout",
        icon:<LogoutIcon />,
        link:"/login",
        id:"logout"
    }
]
export default SidebarData;