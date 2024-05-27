import React, { useState, useEffect, useContext } from 'react';
import { ContextUser } from '../App';
import { adresaServer, VisuallyHiddenInput, stergemUtilizatorul, neDeconectam } from '../diverse';
import axios from 'axios';
import Button from "@mui/joy/Button";
import Avatar from "@mui/material/Avatar";
import Modal_delete from './Modal_delete.js';
import { useNavigate } from "react-router-dom";


const Profile = (props) => {


    const [user, setUser] = useContext(ContextUser);
    const [srcFile, setSrcFile] = useState('');
    const [isModalOpen, setIsModalOpen] = useState({type: false});
    const navigate = useNavigate();


    useEffect(() => {
        if (user) setSrcFile(`${adresaServer}/${user.uid}.jpg`);
    }, [user]);


    const selectFile = (e) => {
        const data = e.target.files[0];
        const formData = new FormData();
        formData.append('image', data);

        axios.post(`${adresaServer}/uploadImg`, formData, {
            params: { uid: user.uid },
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then((response) => {
            const previewURL = URL.createObjectURL(data);
            setSrcFile(previewURL);
            // console.log(response.data);
        }).catch((error) => {
            console.error("Error uploading the file", error);
        });
    };

    async function handleDeleteUser(){
        const rezultat = await stergemUtilizatorul();
        if(!rezultat){
            props.addNewAlert({id: '9', culoare: 'yellow', mesaj: 'I recommend that you first log out, log back in, and then take the step to delete the user.'});
        }else{
            props.addNewAlert({id: '10', culoare: 'green', mesaj: 'The user has been successfully deleted.'});
            navigate('/');
        }
    }
    
    
   

    return (
        <div>
            <Modal_delete  mes={'Are you sure you want to delete your account?'} isModalOpen={isModalOpen} 
            setIsModalOpen={setIsModalOpen} stergem={handleDeleteUser} />


            <div>
                <Button component="label" color="none">
                    <VisuallyHiddenInput onChange={selectFile} type="file" />
                    <Avatar sx={{ width: 150, height: 150 }} src={srcFile}></Avatar>
                </Button>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 ">Your profile</h2>
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

                <div style={{margin: '10px'}} className="inline-flex rounded-md shadow-sm" role="group">
                    <button onClick={()=>{neDeconectam(); navigate('/')}}  type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Log out
                    </button>
                    
                    <button onClick={()=>{setIsModalOpen({type: true })}} type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Delete account
                    </button>
                </div>

                
               
            </div>
        </div>
    );
};

export default Profile;
