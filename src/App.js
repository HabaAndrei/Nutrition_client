import React, { useEffect, createContext, useState } from 'react'
import Home from './Pages/Home.js';
import Chat_page from './Pages/Chat_page.js';
import Settings from './Pages/Settings.js';
import AlertPage from './Components/AlertPage.js';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { adresaServer, auth, } from './diverse.js';
import {onAuthStateChanged} from 'firebase/auth';

const ContextUser = React.createContext();
const ContextAlert = React.createContext();

const App = () => {

  const [user, setUser] = useState(false);

  const [arWithAlerts, setArWithAlerts] = useState([]);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
  }, []);

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
              <Route path="chatPage" element={<Chat_page />} />
            </Routes>
          </Router>
        </ContextAlert.Provider>
      </ContextUser.Provider>
    </div>
  )
}

export { App, ContextUser, ContextAlert}



// fac o functie univeral pt a stoca mesajele din cov si rap, difereta intre ele este 
//  =>> doar la un parametru conv si rap
