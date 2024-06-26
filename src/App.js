import React, { useEffect, useState } from 'react'
import Home from './Pages/Home.js';
import Chat_page from './Pages/Chat_page.js';
import Settings from './Pages/Settings.js';
import AlertPage from './Components/AlertPage.js';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { adresaServer, auth, } from './diverse.js';
import {onAuthStateChanged} from 'firebase/auth';
import axios from 'axios';

const ContextUser = React.createContext();
const ContextAlert = React.createContext();

const App = () => {

  const [user, setUser] = useState(false);
  const [arWithAlerts, setArWithAlerts] = useState([]);



  useEffect(()=>{
    onAuthStateChanged(auth, (userul) => {
      if (userul) {
        setUser(userul);
      } else {
        setUser(false);
      }
    });
  }, []);

  useEffect(()=>{
    if(user && !user.abonamente){
      axios.post(`${adresaServer}/getDataUser_abonamente`, {email: user.email}).then((data)=>{
        setUser(prev => ({...prev, abonamente: data.data}));
      }).catch((err)=>{
        console.log(err);
      })
    }
  }, [user])

  // console.log(user);

  function addNewAlert(obiectDeAdugat){

    setArWithAlerts((prev)=>{
      const index = prev.findIndex((ob)=>ob.id === obiectDeAdugat.id);
      if(index < 0){
        return [...prev, obiectDeAdugat];
      }else{
        return [...prev];

      }
    })
  }


  return (
    <div>
      <ContextUser.Provider value={[user, setUser]}>
        <ContextAlert.Provider value={[arWithAlerts, setArWithAlerts]}>
        
          <AlertPage  />
          
          <Router>
            <Routes>
              <Route path="settings" element={<Settings addNewAlert={addNewAlert} />} />
              <Route path="/" element={<Home  addNewAlert={addNewAlert} />} />
              <Route path="chatPage" element={<Chat_page   addNewAlert={addNewAlert} />} />
            </Routes>
          </Router>
        </ContextAlert.Provider>
      </ContextUser.Provider>
    </div>
  )
}

export { App, ContextUser, ContextAlert}

