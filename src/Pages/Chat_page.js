import React from 'react'
import Conv from '../Components/Conv.js';
import Rap from '../Components/Rap.js';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";



const Chat_page = () => {

  const navigate = useNavigate();
  const [sizes, setSizes] = useState(['50%', '50%']);
  const [isModalConvOpen, setIsModalConvOpen] = useState(false);
  const [isModalRapOpen, setIsModalRapOpen] = useState(false);


  




  return (
    <div className='fullPageChat'  >
 
      <div className='navbarChat' >
        <nav className="bg-gray-50 dark:bg-gray-700">
          <div className="max-w-screen-xl px-4 py-3 mx-auto  "  >
            <div className="flex items-center">
              <ul  className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                <li>
                  <button onClick={()=>navigate('/')}  className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</button>
                </li>
                <li>
                  <button style={{ display: 'flex', alignItems: 'center' }}
                  onClick={()=>navigate('/settings?comp=profile')}  className="text-gray-900 dark:text-white hover:underline">
                    Settings  <IoSettingsOutline/>
                  </button>
                </li>
                <li >
                  <button style={{ display: 'flex', alignItems: 'center' }}
                    onClick={()=>{setIsModalConvOpen(!isModalConvOpen)}}
                    id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="text-gray-900 dark:text-white hover:underline" >
                    Conversatii {isModalConvOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown/> }
                  </button>
                </li>
                <li  >
                  <button  style={{ display: 'flex', alignItems: 'center' }}
                    onClick={()=>{setIsModalRapOpen(!isModalRapOpen)}}
                    id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="text-gray-900 dark:text-white hover:underline" >
                    Rapoarte  {isModalRapOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown/> }
                  </button>                
                </li>
              </ul>
            </div>
          </div>
        </nav>

      </div>

   

      <div className='divDouaChaturi' >
        <SplitPane
          split='vertical'
          sizes={sizes}
          onChange={setSizes}
        >
          
          <Pane minSize={5} maxSize='95%'>
            <div className='divStanga'>
              <Conv isModalConvOpen={isModalConvOpen} setIsModalConvOpen={setIsModalConvOpen} />
            </div>
          </Pane>
          <Pane minSize={5} maxSize='95%'>
            <div className='divDreapta'>
              <Rap isModalRapOpen={isModalRapOpen} setIsModalRapOpen={setIsModalRapOpen} />
            </div>
          </Pane>

        </SplitPane>
      </div>


    </div>
  )
}

export default Chat_page