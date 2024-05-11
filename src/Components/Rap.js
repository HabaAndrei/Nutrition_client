import React from 'react'
import { LuSend } from "react-icons/lu";
import { useState } from 'react';


const Rap = () => {

  const [textInInput, setTextInInput] = useState('');

  return (
    <div className='fullPage-second' >

      <div className='mes_part' >
        Partea cu mesajele de rapoarte
      
      </div>


      <div className='input_part'  > Partea cu text arrayCuMesaje
  
        <form>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                  <textarea  onChange={(e)=>{setTextInInput(e.target.value)}} value={textInInput} id="comment" rows="4" className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a recipe..." ></textarea>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                  <button  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                      Send <LuSend />
                  </button>
                  
              </div>
          </div>
        </form>


      </div>

    </div>
  )
}

export default Rap