import React from 'react'

import { useNavigate } from "react-router-dom";

const Make_account = () => {

    const navigate = useNavigate();

  return (
    <div  
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
        <button   
        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2" 
        onClick={()=>navigate('/')} >Create account</button>
    </div>
  )
}

export default Make_account