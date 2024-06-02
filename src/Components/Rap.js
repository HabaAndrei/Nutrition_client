import React from 'react'
import { LuSend } from "react-icons/lu";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {calcTotalFood, makeArWithString, punemAltIdInUrl, creamIdConversatie, stergemParamDinUrl, luamIdDinUrl, adresaServer_ai,adresaServer, deruleazaInJos, milisecGreenwich} from '../diverse.js';
import {ContextUser} from '../App.js';
import { FaTrashAlt } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import Modal_delete from './Modal_delete.js';
import { IoMdCloseCircle } from "react-icons/io";
import Loading from './Loading.js';




const Rap = (props) => {

  const [user, setUser] = React.useContext(ContextUser);
  
  const [textInInput, setTextInInput] = useState('');
  const [arrayCuMesaje, setArrayCuMesaje] = useState([]);
  const [arCuConversatii, setArCuConversatii] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({type: false});
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(()=>{
    const id_conversatie = luamIdDinUrl('rap');
    if(id_conversatie )luamConversatiaDupaId(id_conversatie);

  }, [])

  useEffect(()=>{
    deruleazaInJos('scrollJos');
  }, [arrayCuMesaje])


  useEffect(()=>{
    if(props.isModalRapOpen){getConvFromDB('rap', user.uid);};
  }, [props.isModalRapOpen])



  function luamConversatiaDupaId(id_conversatie){
    axios.post(`${adresaServer}/getConvWithId`, {id_conversatie}).then((data)=>{
      let arNou = []
      for(let ob of data.data){
        if(ob['tip_mesaj'] === 'intrebare'){
          arNou.push(ob);
        }else{
          arNou.push({tip_mesaj : 'raspuns', mesaj : JSON.parse(ob.mesaj)})
        }
      }
      setArrayCuMesaje(arNou);
      punemAltIdInUrl('rap', id_conversatie);

    }).catch((err)=>{
      console.log(err);
    })
  }

  function adaugConvInAr(id_conversatie, intrebare){
    setArCuConversatii((prev)=>[...prev, {mesaj: intrebare.slice(0, 10), id_conversatie: id_conversatie}])
  }

  function stocamMesajeleInDB(intrebare, raspuns){
    let  id_conversatie_din_url = luamIdDinUrl('rap');
    if(!id_conversatie_din_url){id_conversatie_din_url  = creamIdConversatie('rap'); 
    adaugConvInAr(id_conversatie_din_url, intrebare)};
    
    try{
      axios.post(`${adresaServer}/stocamMesajele`, {
        arMes: [ {
          tip_mesaj: 'intrebare', mesaj: intrebare, 
        }, {tip_mesaj: 'raspuns', mesaj: raspuns}], 
        id_conversatie: id_conversatie_din_url, data: milisecGreenwich(), uid: user.uid, conversatie: 'rap'}
      ).then((data)=>{
        
      }).catch((err)=>{
        console.log(err);
      })
    }catch(err){
      console.log(err);
    }
    
  }

  function trimiteMesaj(){


    if(!textInInput.length)return;
    setIsLoading(true);

    if(!verifyTokens()){
      props.addNewAlert({id: '8', culoare: 'red', mesaj: 'Unfortunately, you have no more tokens.'});
      return;
    }

    const intrebare = textInInput;
    setArrayCuMesaje([...arrayCuMesaje, {tip_mesaj: 'intrebare', mesaj: textInInput}, {tip_mesaj: 'raspuns', mesaj: []}])
    fetch(`${adresaServer_ai}/analyze_recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // "responseType": "stream"
      },
      body: JSON.stringify({recipe: textInInput})
    })
    .then((response)=>{
      return response.json()
    }).then((data)=>{
      setTextInInput('');
      setIsLoading(false);

      const n = calcTotalFood(data);
      const n2 = makeArWithString(n);
      dropTokens();
      stocamMesajeleInDB(intrebare, JSON.stringify(n2));
      setArrayCuMesaje((obiecte)=>{
        obiecte[obiecte.length - 1].mesaj = n2;
        return [...obiecte];
      })

    }).catch((err)=>{
      console.log(err);
      props.addNewAlert({id: '12', culoare: 'blue', mesaj: 'Unfortunately we have infrastructure problems, come back soon.'});

    })
  }


  function getConvFromDB(conversatie, uid){
    axios.post(`${adresaServer}/getConvFromDB` , {conversatie, uid}).then((data)=>{
      setArCuConversatii(data.data);
    }).catch((err)=>{
      console.log(err);
    })
  }



  function stergemConv(id_conversatie){
    
    axios.post(`${adresaServer}/deleteConv`, {id_conversatie}).then((data)=>{
      setArrayCuMesaje([]);
      let indexConv = arCuConversatii.findIndex((ob)=>ob.id_conversatie === id_conversatie);
      setArCuConversatii(arCuConversatii.slice(0 , indexConv).concat(arCuConversatii.slice(indexConv+1, arCuConversatii.length)));
      // setIsModalOpen({type: false});
    }).catch((err)=>{
      console.log(err);
    })
  }

  function facemNewConv(){
    setArrayCuMesaje([]);
    stergemParamDinUrl('rap');
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
          // setTokeni(tokeni - 1);
        }).catch((err)=>{
          console.log(err);
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
      setIsModalOpen={setIsModalOpen} stergem={stergemConv} id={isModalOpen.id}  />

      {props.isModalRapOpen &&

        (<div id="dropdownNotification" className="z-20  w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
          <IoMdCloseCircle onClick={()=>props.setIsModalRapOpen(false)} style={{cursor: 'pointer'}} /> Reports
        </div>

        <div className="  max_length divide-y divide-gray-100 dark:divide-gray-700">
          {arCuConversatii.map((obiect, index)=>{
            return <a key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="w-full ps-3">
                  <div  onClick={()=>luamConversatiaDupaId(obiect.id_conversatie)} className="cursor_pointer  text-gray-500 text-sm mb-1.5 dark:text-gray-400"> {obiect.mesaj.slice(0, 10)} </div>
                  <div  onClick={()=>{setIsModalOpen({type:true, id:obiect.id_conversatie})}}  style={{ display: 'flex', alignItems: 'center' }} className=" cursor_pointer text-xs text-blue-600 dark:text-blue-500">Delete <FaTrashAlt/></div>
              </div>
            </a>
          })}
        </div>

        <a className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
          <div  onClick={facemNewConv} className=" cursor_pointer  inline-flex items-center ">
            <IoChatbox/>
              New chat
          </div>
        </a>

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
                {index === arrayCuMesaje.length - 1 && isLoading ? 
                  <Loading/> : 
                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    {obiect.mesaj.length ? obiect.mesaj.map((nutrient, index)=>{
                      return <li key={index} > {nutrient}</li>
                    }) : <div></div> }                 
                  </ul>
                }
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

export default Rap;