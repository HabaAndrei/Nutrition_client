import React, { useState, useEffect, useContext } from 'react';
import { ContextUser } from '../App';
import { adresaServer, VisuallyHiddenInput } from '../diverse';
import axios from 'axios';
import Button from "@mui/joy/Button";
import Avatar from "@mui/material/Avatar";

const Profile = () => {
    const [user, setUser] = useContext(ContextUser);
    const [srcFile, setSrcFile] = useState('');

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

    return (
        <div>
            <div>
                <Button component="label" color="none">
                    <VisuallyHiddenInput onChange={selectFile} type="file" />
                    <Avatar sx={{ width: 150, height: 150 }} src={srcFile}></Avatar>
                </Button>
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
    );
};

export default Profile;
