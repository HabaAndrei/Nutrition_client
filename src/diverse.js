import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut,  onAuthStateChanged, deleteUser } from "firebase/auth";
import axios from 'axios';

const adresaServer = 'http://localhost:5000';
const adresaServer_ai = 'http://localhost:4000';

function milisecGreenwich() {
    let  date = new Date(); 
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000); 
    let  currentTimeMillisGMT = utc + (3600000 * 0); 
    return currentTimeMillisGMT;
}

// ==> firebase

const provider = new GoogleAuthProvider();
    

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY ,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
}
const app = initializeApp(firebaseConfig);

const auth = getAuth();



function neDeconectam(){
    signOut(auth).then(() => {
        console.log('te ai deconectat cu succes!')
    }).catch((error) => {
        console.log(error);
    });
}


function stergemUtilizatorul(){
    const user = auth.currentUser;
   
    deleteUser(user).then(() => {
        axios.post(`${adresaServer}/stergemUtilizatorul`, {uid: user.uid}).then((data)=>{
            console.log(data);
        })
    }).catch((error) => {
        console.log(error);
    });
}

// <<<==== firebase

export { adresaServer_ai, adresaServer, firebaseConfig, stergemUtilizatorul,  neDeconectam, provider, auth, milisecGreenwich}