import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { adresaServer, provider, auth, milisecGreenwich } from '../diverse';
import { signInWithPopup } from "firebase/auth";
import {firebaseConfig, stergemUtilizatorul, neDeconectam} from '../diverse';
import {ContextUser} from '../App.js';



const Home = () => {
  const [user, setUser] = React.useContext(ContextUser);
  const [scrisInTestarea, setScrisInTestarea] = useState('')
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);

  function neConectamCuGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const milisec = milisecGreenwich();
        axios.post(`${adresaServer}/insertDateU_google`, {
        uid: user.uid, email:user.email, name: user.displayName, milisec,  metoda_creare: 'google'
        }).then((data)=>{
        // console.log(data);
        })
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
    });
}

  useEffect(()=>{
    if(user){
      // console.log(user);
    }else{
      // console.log(user, 'nu e utilizatorul');
    }
  }, [user])

  function trimiteMesaj(){
    axios.get("https://api.ipify.org/?format=json").then((data)=>{
      const adresa = data.data.ip;
      axios.post(`${adresaServer}/verificamCrediteGratis`, {ip_address: adresa}).then((data)=>{
        console.log(data.data);
        if(data.data > 3){
          console.log('ai folosit deja prea multe mesaje gratis')
        }else{
          // aici las sa faca query ul
        }
      })
    })
  }
  

  return (
    <div  className='background' >

      {/* divul de sus */}
      <div>

        <h1>{user.uid}</h1>

        <button onClick={()=>{stergemUtilizatorul(); setUser(false)}} >Stergemmmm</button>
        
        <button  onClick={()=>{neDeconectam(); setUser(false)}} >Deconectam</button>


        <button onClick={neConectamCuGoogle} className="gsi-material-button">
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1"  viewBox="0 0 48 48"  style={{display: 'block'}}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">Connect with Google</span>
          </div>
        </button>

      </div>

      {/* divul cu conversatia */}
      <div className='divConversatie'  >

        <div>
          {/*
    
          <div  className="flex items-start gap-2.5 marginDreaptaCovAi justify-end">
            <div className="divIntrebareAi flex  max-w-[400px]  p-4 border-gray-200 rounded-l-xl rounded-tr-xl dark:bg-gray-700">
              
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">mesajjj</p>
            </div>
          </div>

          <div  className="flex items-start gap-2.5 marginStangaCovAi ">
            <div className="  flex  max-w-[400px] p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">mesajjjjjj</p>   
            </div>
          </div>
        */}


        </div>


        <div>
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <textarea onChange={(e)=>{setScrisInTestarea(e.target.value)}}  value={scrisInTestarea} id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
            <button
            onClick={trimiteMesaj}
            type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
              <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>


      <div>
        <p>Partea de jos interactiva !!!!!!!!!!!!!</p>
        
      </div>
      

    </div>
  )
}

export default Home