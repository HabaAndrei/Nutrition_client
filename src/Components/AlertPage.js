import React from 'react'
import {ContextUser, ContextAlert} from '../App.js';
import { IoWarningOutline } from "react-icons/io5";


const AlertPage = (props) => {

    const [arWithAlerts, setArWithAlerts] = React.useContext(ContextAlert);


    function scoatemEroare(index){
        setArWithAlerts((prev)=>{
            return [...prev.slice(0, index), ...prev.slice(index + 1, index.length)]
        })
    }
    return (
    <div className='alertPage' >
        
        {arWithAlerts.map((obiect, index)=>{

            return  <div key={index} className={` ${obiect.culoare} flex items-center p-4 mb-4 text-800 border-t-4 border-300 bg-50 dark:text-400 dark:bg-gray-800 dark:border-800`} role="alert">
               <IoWarningOutline/>
                <div className="ms-3 text-sm font-medium">
                    {obiect.mesaj}
                </div>
                <button onClick={()=>scoatemEroare(index)} type="button" className={`ms-auto -mx-1.5 -my-1.5 bg-black-50 text-500 rounded-lg focus:ring-2 focus:ring-400 p-1.5 hover:bg-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-${obiect.culoare}-400 dark:hover:bg-gray-700`} data-dismiss-target="#alert-border-1" aria-label="Close">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>

        })}
    </div>
    )

}

export default AlertPage