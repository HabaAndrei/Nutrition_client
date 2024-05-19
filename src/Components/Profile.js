import React from 'react'
import {ContextUser} from '../App';
import { useState, useEffect } from 'react';

const Profile = () => {
    const [user, setUser] = React.useContext(ContextUser);
    const [file, setFile] = useState('');
    function selectFile(e){
        const data = e.target.files[0];
        const formData = new FormData();
        formData.append('image', data);
        
        const previewURL = URL.createObjectURL(data);

        setFile(previewURL);
        // console.log(formData);

    }
  return (
    <div>
        <div>


            <div  >
                <input accept="image/*" onChange={selectFile} type='file' name='file' />
                <button>Apasa ma</button>

                <img src={file}  />
            </div>


            <p>-------------------------------</p>
            
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Your profile</h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-none list-inside dark:text-gray-400">
                <li>
                    Name: {user?.displayName}
                </li>
                <li>
                    Email: {user?.email}
                </li>
                <li>
                    Created at: {user?.metadata?.creationTime}
                </li>
            </ul>

        </div>
    </div>
  )
}

export default Profile