import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut,  onAuthStateChanged, deleteUser } from "firebase/auth";
import axios from 'axios';
import uuid from 'react-uuid';


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
   
    try{
        deleteUser(user).then(() => {
            axios.post(`${adresaServer}/stergemUtilizatorul`, {uid: user.uid}).then((data)=>{
                // console.log(data);
            })
        })
    }catch(err){
        console.log(err);
    }
}

function neConectamCuGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const milisec = milisecGreenwich();
        try{
          axios.post(`${adresaServer}/insertDateU_google`, {
            uid: user.uid, email:user.email, name: user.displayName, milisec,  metoda_creare: 'google'
            }).then((data)=>{
            // console.log(data);
          })
        }catch (err){
          console.log(err);
        }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
  }

// <<<==== firebase


// =>>> parametru url


function creamIdConversatie(id_name){
    const id = uuid().slice(0, 10);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(id_name, id);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);  
    return id;
}

function punemAltIdInUrl(conversatie, id){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(conversatie, id);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);  
    return id;
}

function stergemParamDinUrl(param){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(param);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
}

function luamIdDinUrl(param){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


function putParamSetPage(param){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('comp', param);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);  
}
// <<<<====== parametru url



function deruleazaInJos (id){
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  
};

///// =>>>>>>>> editare data din raport nutrienti 
function returnValNum(catitate, valPerSuta){
    return (catitate / 100) * valPerSuta;
}

function returnNutrients(arrayCuAlimente){
    const arDeSarit = ['food_name', 'id'];
    const obCuValorileTotale = {};

    for(let aliment of arrayCuAlimente){
        let quantity = aliment.quantity;
        if(isNaN(quantity))quantity = 1;
        for(let ob_nutrient of aliment.nutrients){

            let numeNutrient = Object.keys(ob_nutrient)[0]
            if(arDeSarit.includes(numeNutrient))continue;
            let str_num_and_valCant = Object.values(ob_nutrient)[0];
            const ar_nr_cant = str_num_and_valCant.split(' ');
            
            let numarPerSuta = Number(ar_nr_cant[0]);
            if (isNaN(numarPerSuta))numarPerSuta = 0;
            const cantitateaFinala = returnValNum(quantity, numarPerSuta)
            if(obCuValorileTotale[numeNutrient]?.['unitate_de_masura']){
                obCuValorileTotale[numeNutrient]['cantitate'] += cantitateaFinala;
            }else{
                obCuValorileTotale[numeNutrient] = {};
                obCuValorileTotale[numeNutrient]['unitate_de_masura'] = ar_nr_cant[1];
                obCuValorileTotale[numeNutrient]['cantitate'] = cantitateaFinala;
            }

        }
    }
    return (obCuValorileTotale)
}

function returnArStr(ob_de_ob){
    // console.log(ob_de_ob);

    let ar_str_fin = [];
    for(let cheie of Object.keys(ob_de_ob)){
        const numeNutrient = (cheie[0].toUpperCase() + cheie.slice(1, cheie.length)).replace(/_/g, ' ');
        let valoare = JSON.stringify(ob_de_ob[cheie]['cantitate']).slice(0, 5) + ' ' +ob_de_ob[cheie]['unitate_de_masura']
        ar_str_fin.push(numeNutrient + ' ' + valoare);
    }
    return ar_str_fin;
}
//// <<<<<<<<<=============

export {returnArStr, returnNutrients, putParamSetPage, neConectamCuGoogle, punemAltIdInUrl, creamIdConversatie, stergemParamDinUrl, luamIdDinUrl, deruleazaInJos, adresaServer_ai, adresaServer, firebaseConfig, stergemUtilizatorul,  neDeconectam, provider, auth, milisecGreenwich}