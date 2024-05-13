import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {ContextUser} from '../App.js';
import {punemAltIdInUrl, creamIdConversatie, stergemParamDinUrl, luamIdDinUrl, adresaServer_ai,adresaServer, deruleazaInJos, milisecGreenwich} from '../diverse.js';

const Conv = (props) => {

  const [user, setUser] = React.useContext(ContextUser);
  const [textInInput, setTextInInput] = useState('');
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);
  const [arCuConversatii, setCuConversatii] = useState([]);
  const [ar_mes_stream, setAr_Mes_Stream] = useState([]);

  useEffect(()=>{
    const id_conversatie = luamIdDinUrl('conv')
    luamConversatiaDupaId(id_conversatie);
  }, [])

  useEffect(()=>{
    deruleazaInJos('scrollJos_doi');
  }, [arrayCuMesaje])
  
  useEffect(()=>{
    if(props.isModalConvOpen){getConvFromDB('conv', user.uid)};
  }, [props.isModalConvOpen])

  useEffect(()=>{
    if(!ar_mes_stream.length)return;
    setArrayCuMesaje((prev)=>{
      prev[prev.length - 1].mesaj = [...ar_mes_stream].join('');
      return [...prev];
    })
    console.log([...ar_mes_stream].join(''));
  }, [ar_mes_stream])

  function luamConversatiaDupaId(id_conversatie){
    axios.post(`${adresaServer}/getConvWithId`, {id_conversatie}).then((data)=>{
      setArrayCuMesaje(data.data);
    })
  }


  

  function stocamMesajeleInDB(intrebare, raspuns){
    let id_conversatie_din_url = luamIdDinUrl('conv');
    if(!id_conversatie_din_url) id_conversatie_din_url = creamIdConversatie('conv');

    try{
      axios.post(`${adresaServer}/stocamMesajele`, {
        arMes: [ {
          tip_mesaj: 'intrebare', mesaj: intrebare, 
        }, {tip_mesaj: 'raspuns', mesaj: raspuns}], 
        id_conversatie: id_conversatie_din_url, data: milisecGreenwich(), uid: user.uid, conversatie: 'conv'}
      ).then((data)=>{
          // console.log(data);
        }
      )
    }catch(err){
      console.log(err);
    }
  }

  function trimitemMesajulAi(){

    const intrebare = textInInput;
    setArrayCuMesaje([...arrayCuMesaje, {tip_mesaj: 'intrebare', mesaj: textInInput}, {tip_mesaj: 'raspuns', mesaj: ''}])
    fetch(`${adresaServer_ai}/send_mes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "responseType": "stream"
      },
      body: JSON.stringify({ context: [...arrayCuMesaje?.slice(-4), { tip_mesaj: 'intrebare', mesaj: textInInput }] })
    })
    .then((response)=>{
      let raspunsul_stream = ''
      setTextInInput('');

      let reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      function readStream(){
        reader.read().then(({done, value})=>{
          if(done){
            stocamMesajeleInDB(intrebare, raspunsul_stream);
          }else{
            let cuv =  decoder.decode(value, {stream: true});
            raspunsul_stream += cuv;
            setAr_Mes_Stream(prev => [...prev, cuv]);

            readStream();
          }
        });
      }

      readStream();

    })
  }



  function getConvFromDB(conversatie, uid){
    axios.post(`${adresaServer}/getConvFromDB` , {conversatie, uid}).then((data)=>{
      setCuConversatii(data.data);
    })
  }



  function getMesFromDB(id_conversatie){
    axios.post(`${adresaServer}/getMesFromDB`, {id_conversatie}).then((data)=>{
      setArrayCuMesaje(data.data);
      punemAltIdInUrl('conv', id_conversatie);

    })
  }

  return (
    <div className='fullPage-second' >


      {props.isModalConvOpen &&

      (<div id="dropdownRadioHelper" className="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600">
        <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioHelperButton">
          
          {arCuConversatii.map((obiect, index)=>{
            return <li onClick={()=>getMesFromDB(obiect.id_conversatie)} key={index} >
              <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="ms-2 text-sm">
                    <label  className="font-medium text-gray-900 dark:text-gray-300">
                      <div>{obiect.mesaj}</div>
                    </label>
                </div>
                
              </div>
            </li>
          })}
        </ul>
      </div>)}

      <div className='mes_part' id='scrollJos_doi' >
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

      <div className='input_part' >
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <textarea onChange={(e)=>{setTextInInput(e.target.value)}}  value={textInInput} id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
          <button
          onClick={trimitemMesajulAi}
           className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}

export default Conv