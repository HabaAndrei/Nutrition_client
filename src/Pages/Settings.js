import React from 'react';
import { useState, useEffect } from 'react'
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Test_component from '../Components/Test_component.js';
import Pay_component from '../Components/Pay_component.js';
import {putParamSetPage, luamIdDinUrl, stergemParamDinUrl} from '../diverse.js'

const Settings = (props) => {

  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();
  const [componentRight, setComponentRight] = useState(1);

  const obCuParams = {1 : 'pay', 2 :'test'};
  
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
    <div className='setPage' >

      {isNavOpen && <div className='setPageNav' >

        <div>
          <ul className="space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
            <li>
                <a  className="inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600" aria-current="page">
                    <svg className="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    Profile
                </a>
            </li>
            <li>
                <button onClick={()=>setComponentRight(1)} className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                    Plata stripe!!!
                </button>
            </li>
            <li>
                <button onClick={()=>navigate('/chatPage')} className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                  Chat_page
                </button>
            </li>
            <li>
                <button onClick={()=>setComponentRight(2)} className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                    
                    Test
                </button>
            </li>
            <li>
                <a className="inline-flex items-center px-4 py-3 text-gray-400 rounded-lg cursor-not-allowed bg-gray-50 w-full dark:bg-gray-800 dark:text-gray-500">    
                Disabled
                </a>
            </li>
          </ul>
        </div>
      </div>}


      <div className='setPageCont' >
        <button  className='butonInchisDeschis' onClick={()=>setIsNavOpen(!isNavOpen)}  >        {isNavOpen ? <FaRegArrowAltCircleLeft/> : <FaRegArrowAltCircleRight/> }</button>
      
        {componentRight === 2 &&
          <Test_component/>
        }

        {componentRight === 1 &&
          <Pay_component/>
        }
      
      </div>

        
    </div>
  )
}

export default Settings