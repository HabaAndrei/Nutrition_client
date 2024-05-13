import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { stergemUtilizatorul, adresaServer_ai, adresaServer, provider, auth, milisecGreenwich, neDeconectam } from '../diverse';
import { signInWithPopup } from "firebase/auth";
import {ContextUser} from '../App.js';
import { useNavigate } from "react-router-dom";




const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useContext(ContextUser);
  const [scrisInTextarea, setScrisInTextarea] = useState('')
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);
  const [ar_mes_stream, setAr_Mes_Stream] = useState([]);

  useEffect(()=>{
    if(!ar_mes_stream.length)return;
    setArrayCuMesaje((prev)=>{
      prev[prev.length - 1].mesaj = [...ar_mes_stream].join('');
      return [...prev];
    })
    console.log([...ar_mes_stream].join(''));
  }, [ar_mes_stream])



  function neConectamCuGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const milisec = milisecGreenwich();
        try{
          axios.post(`${adresaServer}/insertDateU_google`, {
            uid: user.uid, email:user.email, name: user.displayName, milisec,  metoda_creare: 'google'
            }).then((data)=>{
            // console.log(data);
          })
        }catch (err){
          console.log(err);
        }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
    });
  }


  function trimiteMesaj(){
    try{
      axios.get("https://api.ipify.org/?format=json").then((data)=>{
        const adresa = data.data.ip;


        axios.post(`${adresaServer}/verificamCrediteGratis`, {ip_address: adresa}).then((data)=>{
          
          if(data.data[0].result >  5 /*  =>> sa mut aici 3 */){
            console.log('ai folosit deja prea multe mesaje gratis')
          }else{
            
            setArrayCuMesaje([...arrayCuMesaje, {tip_mesaj: 'intrebare', mesaj: scrisInTextarea}, {tip_mesaj: 'raspuns', mesaj: ''}])
            fetch(`${adresaServer_ai}/send_mes`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                "responseType": "stream"
              },
              body: JSON.stringify({ context: [...arrayCuMesaje?.slice(-4), { tip_mesaj: 'intrebare', mesaj: scrisInTextarea }] })
            })
            .then((response)=>{

              setScrisInTextarea('');

              let reader = response.body.getReader();
              const decoder = new TextDecoder();
              
              function readStream(){
                reader.read().then(({done, value})=>{
                  if(done){
                    // console.log('este gata maiii')
                    setAr_Mes_Stream([]);
                  }else{
                    
                    let cuv =  decoder.decode(value, {stream: true});
                    
                    setAr_Mes_Stream(prev => [...prev, cuv]);

                    readStream();
                  }
                });
              }

              readStream();

              // console.log(ok);
              console.log('--- se executa fetchul!!!!');

            })
          }
        })
      })
    }catch (err){
      console.log(err);
    }
  }

  

  

  return (
    <div  className='background' >

      
      {/* divul de sus */}


      <div className='divSus' >

        <nav className=" 
        border-gray-200 ">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <a className="flex items-center space-x-3 rtl:space-x-reverse">
            </a>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              {!user ?
                <button onClick={neConectamCuGoogle} type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
                  <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                    <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
                  </svg>
                  Sign in with Google
                </button>
                : 
                <button  onClick={()=>{navigate('/chatPage')}} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Continue
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </button>
              }
            </div>
          </div>
        </nav>
        <nav className="bg-gray-50 dark:bg-gray-700">
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                        <li>
                            <a  className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a className="text-gray-900 dark:text-white hover:underline">Company</a>
                        </li>
                        <li>
                            <button onClick={stergemUtilizatorul} className="text-gray-900 dark:text-white hover:underline">Delete user</button>
                        </li>
                        <li>
                            <button onClick={neDeconectam} className="text-gray-900 dark:text-white hover:underline">Deconecteaza te </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

      </div>

      {/* divul cu conversatia */}
      <div className='divConversatie'  >

        <div>

          {arrayCuMesaje.map((obiect, index)=>{

            if(obiect.tip_mesaj === 'intrebare'){
              return <div key={index} className="flex items-start gap-2.5 marginDreaptaCovAi justify-end">
                <div className="divIntrebareAi flex  max-w-[400px]  p-4 border-gray-200 rounded-l-xl rounded-tr-xl dark:bg-gray-700">
                
                  <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>
                </div>
              </div>
            }else{
              return <div key={index} className="flex items-start gap-2.5 marginStangaCovAi ">
                <div className="  flex  max-w-[400px] p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
                  <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>   
                </div>
              </div>
            } 
          })}

        </div>


        <div>
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <textarea onChange={(e)=>{setScrisInTextarea(e.target.value)}}  value={scrisInTextarea} id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
            <button
            onClick={()=>{if(scrisInTextarea.length)trimiteMesaj()}}
            type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
              <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>


      <div>
        <p>Aici sa fac o parte de statistici cu top 100 grame proteina vitamina etc</p>
        
      </div>
      

    </div>
  )
}

export default Home