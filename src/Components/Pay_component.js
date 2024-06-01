import React from 'react'
import { useEffect, useState } from 'react'
import { adresaServer } from '../diverse.js'
import {ContextUser} from '../App.js';
import axios from 'axios';
import Modal_delete from './Modal_delete.js';


const Pay_component = () => {

  const [user, setUser] = React.useContext(ContextUser);
  const [isModalOpen, setIsModalOpen] = useState({type: false});

  const produse = [{name: 'Small package', price: 7, id: '1', tokens: 100},
  {name: 'Mediul package', price: 12, id: '2', tokens: 300},
  {name: 'Mediul package', price: 14, id: '3', tokens: 400},

  ]
  //product name, price, produs id

  function deleteSubscription(id){
    axios.post(`${adresaServer}/deleteSubscription`, {id}).then((data)=>{
      let noulArray = [];
      for(let obiect of user.abonamente){
        if(obiect.id_abonament != id) noulArray.push(obiect);
      }
      setUser((prev)=> ({...prev, abonamente : [...noulArray]}))
    }).catch((err)=>{
      console.log(err);
    })
  }


  
    
  return (
    <div  >

      <Modal_delete  mes={'Are you sure you want to delete this subscription?'} isModalOpen={isModalOpen} 
      setIsModalOpen={setIsModalOpen} stergem={deleteSubscription} id={isModalOpen.id} />


      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
            <thead className="text-xs text-white uppercase bg-blue-600 border-b border-blue-400 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3 bg-blue-500">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3"> 
                  Number of tokens
                </th>
                <th scope="col" className="px-6 py-3 bg-blue-500">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {produse.map((produs, index)=>{

              return <tr key={index} className="bg-blue-600 border-b border-blue-400">
                <th scope="row" className="px-6 py-4 font-medium bg-blue-500 text-blue-50 whitespace-nowrap dark:text-blue-100">
                    {produs.name}
                </th>
                <td className="px-6 py-4">
                    {produs.tokens}
                </td>
                <td className="px-6 py-4 bg-blue-500">
                    {produs.price} $
                </td>
                <td className="px-6 py-4">
                  {/* <button  className="font-medium text-white hover:underline">Buy</button> */}
                
                  <form action={`${adresaServer}/create-checkout-session?id=${produs.id}`} method="POST">
                    <button type="submit">
                      Buy
                    </button>
                  </form>
                </td>
              </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{padding: '10px'}} >
        {user?.abonamente?.length ? user.abonamente.map((obiect, index)=>{

          if(obiect.id_abonament === 'gratis'){
            return <div key={index} ></div>
          }else{
            return <ul key={index} className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
              <li className='mb-2 text-lg font-semibold text-gray-900' >
                Subscription 
              </li>
              <li>
                Started: {new Date(Number(obiect.inceput_abonament)).toLocaleString().slice(0, 10)}
              </li>
              <li>
                Next pay: {new Date(Number(obiect.final_abonament)).toLocaleString().slice(0, 10)}
              </li>
              <li>
                Price: {obiect.pret_abonament}€
              </li>
              <li>
                Remaining tokens: {obiect.numar_tokeni}
              </li>
              <li>
                <button onClick={()=>{setIsModalOpen({type:true, id: obiect.id_abonament})}} >Delete subscription</button>
              </li>
            
            </ul>
          }
        }) : <div></div> }
      </div>

    </div>
  )
}

export default Pay_component