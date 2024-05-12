import React from 'react'
import { LuSend } from "react-icons/lu";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {creamIdConversatie, stergemParamDinUrl, luamIdDinUrl, adresaServer_ai,adresaServer, deruleazaInJos, milisecGreenwich} from '../diverse.js';
import {ContextUser} from '../App.js';


const Rap = (props) => {

  const [user, setUser] = React.useContext(ContextUser);

  const [textInInput, setTextInInput] = useState('');
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);

  function luamConversatiaDupaId(id_conversatie){
    axios.post(`${adresaServer}/getConvWithId`, {id_conversatie}).then((data)=>{
      setArrayCuMesaje(data.data);
    })
  }


  useEffect(()=>{
    const id_conversatie = luamIdDinUrl('rap')
    luamConversatiaDupaId(id_conversatie);
  }, [])


  function stocamMesajeleInDB(intrebare, raspuns){
    let  id_conversatie_din_url = luamIdDinUrl('rap');
    if(!id_conversatie_din_url)id_conversatie_din_url  = creamIdConversatie('rap');

    
    try{
      axios.post(`${adresaServer}/stocamMesajele`, {
        arMes: [ {
          tip_mesaj: 'intrebare', mesaj: intrebare, 
        }, {tip_mesaj: 'raspuns', mesaj: raspuns}], 
        id_conversatie: id_conversatie_din_url, data: milisecGreenwich(), uid: user.uid, conversatie: 'rap'}
      ).then((data)=>{
          
          
        }
      )
    }catch(err){
      console.log(err);
    }
    
  }

  function trimiteMesaj(){
    const intrebare = textInInput;
    setArrayCuMesaje([...arrayCuMesaje, {tip_mesaj: 'intrebare', mesaj: textInInput}, {tip_mesaj: 'raspuns', mesaj: ''}])
    fetch(`${adresaServer_ai}/analyze_recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // "responseType": "stream"
      },
      body: JSON.stringify({recipe: textInInput})
    })
    .then((response)=>{
      return response.text()
    }).then((data)=>{
      setTextInInput('');

      /////

      console.log(data, 'asta vine din py server')

      /////


      
      stocamMesajeleInDB(intrebare, data);
      setArrayCuMesaje((obiecte)=>{
        obiecte[obiecte.length - 1].mesaj += data;
        return [...obiecte];
      })
    })
  }

  useEffect(()=>{
    deruleazaInJos('scrollJos');
  }, [arrayCuMesaje])


  return (
    <div className='fullPage-second' >


      {props.isModalRapOpen &&
      (<div id="dropdownRadioHelper" className="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600">
        <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioHelperButton">
        <li>
          <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex items-center h-5">
                <input id="helper-radio-4" name="helper-radio" type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                  </input>
            </div>
            <div className="ms-2 text-sm">
                <label  className="font-medium text-gray-900 dark:text-gray-300">
                  <div>Individual</div>
                  <p id="helper-radio-text-4" className="text-xs font-normal text-gray-500 dark:text-gray-300">Some helpful instruction goes over here.</p>
                </label>
            </div>
          </div>
        </li>
        <li>
          <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex items-center h-5">
                <input id="helper-radio-5" name="helper-radio" type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                </input>
            </div>
            <div className="ms-2 text-sm">
                <label className="font-medium text-gray-900 dark:text-gray-300">
                  <div>Company</div>
                  <p id="helper-radio-text-5" className="text-xs font-normal text-gray-500 dark:text-gray-300">Some helpful instruction goes over here.</p>
                </label>
            </div>
          </div>
        </li>
        </ul>
      </div>)}

      <div className='mes_part' id='scrollJos' >
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


      <div className='input_part'  > 
        
        <div className="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <textarea  onChange={(e)=>{setTextInInput(e.target.value)}} value={textInInput} id="comment" rows="4" className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a recipe..." ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                <button onClick={trimiteMesaj}  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    Send <LuSend />
                </button>
                
            </div>
        </div>
        


      </div>

    </div>
  )
}

export default Rap