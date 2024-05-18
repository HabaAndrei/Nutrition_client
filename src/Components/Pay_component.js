import React from 'react'
import { useEffect, useState } from 'react'
import { adresaServer } from '../diverse.js'

const Pay_component = () => {

    function payProduct(){

    }
    
  return (
    <div style={{background: 'yellow'}} >

        plata!!!!!!!!!!!!
        <form action={`${adresaServer}/create-checkout-session`} method="POST">
            <button type="submit">
                Checkout
            </button>
        </form>
    </div>
  )
}

export default Pay_component