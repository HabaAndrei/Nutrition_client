import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { neConectamCuGoogle,  adresaServer_ai, adresaServer,  deruleazaInJos } from '../diverse';
import {ContextUser} from '../App.js';
import { useNavigate } from "react-router-dom";
import Loading from '../Components/Loading.js';




const Home = (props) => {

  const navigate = useNavigate();
  const [user, setUser] = React.useContext(ContextUser);
  const [scrisInTextarea, setScrisInTextarea] = useState('')
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);
  const [ar_mes_stream, setAr_Mes_Stream] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(()=>{
    if(!ar_mes_stream.length)return;
    setArrayCuMesaje((prev)=>{
      prev[prev.length - 1].mesaj = [...ar_mes_stream].join('');
      return [...prev];
    })
  }, [ar_mes_stream])




  function trimiteMesaj(){

    if(!scrisInTextarea.length)return;

    setIsLoading(true);

    try{
      axios.post(`${adresaServer}/verificamCrediteGratis`).then((data)=>{
        
        if(data.data[0].result >  5 /*  =>> sa mut aici 3 */){
          props.addNewAlert({id: '1', culoare: 'yellow', mesaj: 'Unfortunately, you have already used your free messages, log in to continue using the application.'});
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
            setIsLoading(false);

            let reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            function readStream(){
              reader.read().then(({done, value})=>{
                if(done){
                  setTimeout(()=>setAr_Mes_Stream([]), 500);
                }else{
                  
                  let cuv =  decoder.decode(value, {stream: true});
                  
                  setAr_Mes_Stream(prev => [...prev, cuv]);

                  readStream();
                }
              });
            }

            readStream();
          }).catch((err)=>{
            console.log(err);
            props.addNewAlert({id: '12', culoare: 'blue', mesaj: 'Unfortunately we have infrastructure problems, come back soon.'});
          })
        }
      }).catch((err)=>{
        console.log(err);
      })
     
    }catch (err){
      console.log(err);
    }
  }

  

  return (
    <div  className='background' >


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
        

      </div>


      <div style={{padding: '20px'}}  >
        
        <a className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="../../poza_1.jpg" alt="" />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Smart nutrition</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Welcome to us. We will make sure you have a good experience.</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400" >We are an artificial intelligence company that through our work offers recipes for when you don't have inspiration. Recipes with any type of food. We analyze recipes to provide the correct nutritional values.</p>
            </div>
        </a>

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
                {index === arrayCuMesaje.length - 1 && isLoading ? 
                  <Loading/> : 
                  <div className="  flex  max-w-[400px] p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>   
                  </div>
                }
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


      <div style={{'padding': '20px'}}  className="flex justify-end" >
        
        <a  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> 'Mens sana in corpore sano' </h5>
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">A healthy mind in a healthy body.</span>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"> 
                  We offer the possibility to have different conversations with our nutrition bot so that it takes a history and to be able to keep the recipes without being modified.
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"> 
                  This site was made out of passion and to help the world to be more responsible for its food.
                </p>

            </div>
        </a>

      </div>

      <div style={{padding: '20px'}}  >
        
        <a className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Statistics:</h5>
              <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                <li>
                  Over 1.9 billion adults, 18 years and older, are overweight. Of these, more than 650 million are obese.
                </li>

                <li>
                 Over 340 million children and adolescents aged 5-19 were overweight or obese in 2016.
                </li>

                <li>
                  {'High sodium consumption (>2 grams/day) is prevalent globally, increasing the risk of cardiovascular diseases. The WHO recommends reducing sodium intake to less than 2 grams per day.'}
                </li>
                <li>
                  WHO recommends reducing the intake of free sugars to less than 10% of total energy intake. Reducing it to below 5% has additional health benefits.
                </li>
                <li>
                  It is a significant public health issue in over half of all countries, especially in Africa and Southeast Asia, affecting approximately 250 million preschool children.
                </li>

              </ul>
              
          </div>
        </a>

      </div>

      <div>
        
        <div className='bg-gray-50 dark:bg-gray-700' >
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="" className="hover:underline">Nutrition™</a>. All Rights Reserved.</span>
        </div>
      </div>
      

    </div>
  )
}

export default Home