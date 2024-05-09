import React from 'react'

const Chat_page = () => {






  return (
    <div className='fullPageChat'  >

      <div className='navbarChat' >
      <nav className="bg-gray-50 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline">Company</a>
              </li>
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline">Team</a>
              </li>
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline">Features</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      </div>

   

      <div className='divDouaChaturi' >
        divDouaChaturi
        <div className="divStanga">
          Conținut pentru divul din stânga 
        </div>
        <div className="linie"></div> 
        <div className="divDreapta">
          Conținut pentru divul din dreapta
        </div>
      </div>

    </div>
  )
}

export default Chat_page