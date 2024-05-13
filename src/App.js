import React, { useEffect, createContext, useState } from 'react'
import Home from './Pages/Home.js';
import Chat_page from './Pages/Chat_page.js';
import Settings from './Pages/Settings.js';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { adresaServer, auth, } from './diverse.js';
import {onAuthStateChanged} from 'firebase/auth'
const ContextUser = React.createContext();


const App = () => {

  const [user, setUser] = useState(false);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
  }, [])

  return (
    <div>
      <ContextUser.Provider value={[user, setUser]}>
        <Router>

          <Routes>
            <Route path="settings" element={<Settings />} />
            <Route path="/" element={<Home />} />
            <Route path="chatPage" element={<Chat_page />} />
          </Routes>
        </Router>
      </ContextUser.Provider>
    </div>
  )
}

export { App, ContextUser}

// fac metoda prin care sa se stearga conversatia dar si sa fac cu scroll in divul cu conversatii

// fac o functie univeral pt a stoca mesajele din cov si rap, difereta intre ele este 
//  =>> doar la un parametru conv si rap
