import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {ContextUser} from '../App.js';
import { punemAltIdInUrl, creamIdConversatie, stergemParamDinUrl, luamIdDinUrl, adresaServer_ai,adresaServer, deruleazaInJos, milisecGreenwich} from '../diverse.js';
import { FaTrashAlt } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import Modal_delete from './Modal_delete.js';
import { IoMdCloseCircle } from "react-icons/io";
import Loading from './Loading.js';



const Conv = (props) => {

  const [user, setUser] = React.useContext(ContextUser);
  const [textInInput, setTextInInput] = useState('');
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);
  const [arCuConversatii, setArCuConversatii] = useState([]);
  const [ar_mes_stream, setAr_Mes_Stream] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({type: false});
  const [isLoading, setIsLoading] = useState(false);

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
  }, [ar_mes_stream])

  function luamConversatiaDupaId(id_conversatie){
    axios.post(`${adresaServer}/getConvWithId`, {id_conversatie}).then((data)=>{
      setArrayCuMesaje(data.data);
      punemAltIdInUrl('conv', id_conversatie);
    })
  }

  function adaugConvInAr(id_conversatie, intrebare){
    setArCuConversatii((prev)=>[...prev, {mesaj: intrebare.slice(0, 10), id_conversatie: id_conversatie}])
  }

  
  function stocamMesajeleInDB(intrebare, raspuns){
    let  id_conversatie_din_url = luamIdDinUrl('conv');
    if(!id_conversatie_din_url){id_conversatie_din_url  = creamIdConversatie('conv'); 
    adaugConvInAr(id_conversatie_din_url, intrebare)};
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
    
    if(!textInInput.length)return;
    
    setIsLoading(true);
    if(!verifyTokens()){
      props.addNewAlert({id: '8', culoare: 'red', mesaj: 'Unfortunately, you have no more tokens.'});
      return;
    }
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
      let raspunsul_stream = '';
      setTextInInput('');

      let reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      function readStream(){
        setIsLoading(false);
        reader.read().then(({done, value})=>{
          if(done){
            stocamMesajeleInDB(intrebare, raspunsul_stream);
            dropTokens();
            setAr_Mes_Stream([]);

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
      setArCuConversatii(data.data);
    })
  }

  function stergemConv(id_conversatie){    
    axios.post(`${adresaServer}/deleteConv`, {id_conversatie}).then((data)=>{
      setArrayCuMesaje([]);
      let indexConv = arCuConversatii.findIndex((ob)=>ob.id_conversatie === id_conversatie);
      setArCuConversatii(arCuConversatii.slice(0 , indexConv).concat(arCuConversatii.slice(indexConv+1, arCuConversatii.length)));
      // setIsModalOpen({type: false});
    })
  }

  function facemNewConv(){
    setArrayCuMesaje([]);
    stergemParamDinUrl('conv');
    setTextInInput('');
  }

  //////////////////// =>>>>>> scademtokeni

  function dropTokens(){
    const arrayCuAbonamanete = user.abonamente;
    let arNou = [];
    let validareFacuta = false;
    for(let ob_abonament of arrayCuAbonamanete){
      if(validareFacuta){arNou.push(ob_abonament); continue;}

      if(Number(ob_abonament.numar_tokeni) > 0){ob_abonament.numar_tokeni = (Number(ob_abonament.numar_tokeni) - 1);
        arNou.push(ob_abonament); 
        validareFacuta = true;
        axios.post(`${adresaServer}/dropTokens`, {ob_abonament, uid: user.uid}).then((data)=>{
          // console.log(data);
        })
        continue;
      }
    }
    // console.log(arNou, '--------------')
    setUser((prev)=>({...prev, abonamente : [...arNou]}));
  }

  function verifyTokens(){
    const arrayCuAbonamanete = user.abonamente;
    let is_tokens = false;
    if(!arrayCuAbonamanete?.length)return false;
    for(const ob_abonament of arrayCuAbonamanete){
      if(Number(ob_abonament.numar_tokeni) > 0){is_tokens = true; break} 
    }
    return is_tokens;
  }
  
  
  ///////////////////


  return (
    <div className='fullPage-second' >

      <Modal_delete  mes={'Are you sure you want to delete this?'} isModalOpen={isModalOpen} 
      setIsModalOpen={setIsModalOpen} stergem={stergemConv} id={isModalOpen.id} />


      {props.isModalConvOpen &&

      (<div id="dropdownNotification" className="z-20  w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
          <IoMdCloseCircle onClick={()=>props.setIsModalConvOpen(false)} style={{cursor: 'pointer'}} />  Conversations
        </div>

        <div className=" max_length  divide-y divide-gray-100 dark:divide-gray-700">
          {arCuConversatii.map((obiect, index)=>{
            return <a key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="w-full ps-3">
                  <div  onClick={()=>luamConversatiaDupaId(obiect.id_conversatie)} className="cursor_pointer  text-gray-500 text-sm mb-1.5 dark:text-gray-400"> {obiect.mesaj.slice(0, 10)} </div>
                  <div  onClick={()=>{setIsModalOpen({type:true, id:obiect.id_conversatie})}} style={{ display: 'flex', alignItems: 'center' }} className=" cursor_pointer text-xs text-blue-600 dark:text-blue-500">Delete <FaTrashAlt/></div>
              </div>
            </a>
          })}
        </div>

        <a className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
          <div onClick={facemNewConv} className=" cursor_pointer  inline-flex items-center ">
            <IoChatbox/>
              New chat
          </div>
        </a>

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
            
            // return <div key={index} className="flex items-start gap-2.5 marginStangaCovAi ">
            //   <div className="  flex  max-w-[400px] p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
            //     <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>   
            //   </div>
            // </div>
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