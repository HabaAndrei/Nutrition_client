import React from 'react';
import { useState, useEffect } from 'react'
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pay_component from '../Components/Pay_component.js';
import Profile from '../Components/Profile.js';
import {putParamSetPage, luamIdDinUrl, stergemParamDinUrl} from '../diverse.js'

const Settings = (props) => {

  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();
  const [componentRight, setComponentRight] = useState(1);

  const obCuParams = {1 : 'profile', 2 :'pay'};
  
  useEffect(()=>{
    const param = obCuParams[componentRight];
    putParamSetPage(param);
    // const parametruDinUrl  = luamIdDinUrl('comp');
    // console.log(parametruDinUrl)
  }, [componentRight])

  useEffect(()=>{
    const parametruDinUrl  = luamIdDinUrl('pay_finsh');
    if(parametruDinUrl === 'false'){
      console.log('trebuie sa se adauge eroarea')
      props.addNewAlert({id: '2', culoare: 'yellow', mesaj: 'Unfortunately, the payment has not been completed.'});
    }else if(parametruDinUrl === 'true'){
      props.addNewAlert({id: '3', culoare: 'green', mesaj: 'Payment completed successfully!'});
    }
    if(parametruDinUrl)stergemParamDinUrl('pay_finsh');
  }, [])

  
  return (
    <div className='setPage'  >

      {isNavOpen && <div className='setPageNav ' >

        <div>
          <ul className="space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
            <li>
                <button onClick={()=>setComponentRight(1)} className="inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600" aria-current="page">
                    <svg className="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    Profile
                </button>
            </li>
            <li>
                <button onClick={()=>setComponentRight(2)} className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                  Manage payments
                </button>
            </li>
            <li>
                <button onClick={()=>navigate('/chatPage')} className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                  Chat page
                </button>
            </li>
           
          </ul>
        </div>
      </div>}


      <button  className='butonInchisDeschis' onClick={()=>setIsNavOpen(!isNavOpen)}  >        {isNavOpen ? <FaRegArrowAltCircleLeft/> : <FaRegArrowAltCircleRight/> }</button>
      
      <div className='setPageCont' >

        {componentRight === 1 && 
          <Profile   addNewAlert={props.addNewAlert}  />
        }
      
        {componentRight === 2 &&
          <Pay_component  addNewAlert={props.addNewAlert} />
        }

        

      
      </div>

        
    </div>
  )
}

export default Settings