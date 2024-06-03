import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut,  OAuthProvider, reauthenticateWithPopup, deleteUser } from "firebase/auth";
import axios from 'axios';
import uuid from 'react-uuid';
import { styled } from "@mui/system";



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

async function reconectam(){
        
    const prov = new OAuthProvider('google.com');

    let rezultat = false;
    await reauthenticateWithPopup(auth.currentUser, prov)
    .then((result) => {
        const credential = OAuthProvider.credentialFromResult(result);
        rezultat = credential;
    }).catch((error) => {
        rezultat = false;
    });
    return rezultat
}


function neDeconectam(){
    signOut(auth).then(() => {
        console.log('te ai deconectat cu succes!')
    }).catch((error) => {
        console.log(error);
    });
}



async function stergemUtilizatorul(){
    const user = auth.currentUser;
    // console.log(user, '------------')
    let rezultat = {type: true};
    await deleteUser(user).then( async () => {
        // console.log('a intrat sa execute si asat !!!======')
        await axios.post(`${adresaServer}/stergemUtilizatorul`, {uid: user.uid, email: user.email}).then((data)=>{
            // console.log(data);
            rezultat = {type: true};

        }).catch((err)=>{
            console.log(err);
            // rezultat = {type: false, mes: 'Am intampinat o alta eroare la stergere din db'};

        })
    }).catch( async (err)=>{
        if(err['code'] === 'auth/requires-recent-login'){
            // ne reconectam
            const rez = await reconectam();
            if(rez)stergemUtilizatorul();
            else rezultat =  {type: false, mes: 'DUnfortunately, I encountered a problem in deleting the user.'};
        }else{
            rezultat =  {type: false, mes: 'Unfortunately, I encountered a problem in deleting the user.'};

        }

    });
    return rezultat;
}

function neConectamCuGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const milisec = milisecGreenwich();
        
        axios.post(`${adresaServer}/insertDateU_google`, {
        uid: user.uid, email:user.email, name: user.displayName, milisec,  metoda_creare: 'google'
        }).then((data)=>{
        // console.log(data);
        }).catch((err)=>{
        console.log(err);
        })
       
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



function deruleazaInJos(id){
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  
};

///// =>>>>>>>> editare data din raport nutrienti 
function calcTotalFood(arrayCuObMancare){

    const arExcluderi = ['id', 'food_name'];
    const mancareCareAMaiFost = [];
    let obFin = {};
  
    for(let aliment of arrayCuObMancare){
      // verific daca numele mancarii se dubleaza
      if(mancareCareAMaiFost.includes(aliment.name)){continue;
      }else{mancareCareAMaiFost.push(aliment.name)};
  
      const nr_cant = aliment.quantity.split(' ');
      const cantitate_per_portie = Number(nr_cant[0]);
  
      if(obFin['total_food_value']){
        obFin.total_food_value.cant += cantitate_per_portie;
      }else{
        obFin['total_food_value'] = {};
        obFin.total_food_value.cant = cantitate_per_portie;
        obFin.total_food_value.val = 'g' 
      }
  
      for(let ob_nutrient of aliment.nutrients){
        
        const numeNutrient = Object.keys(ob_nutrient)[0]
        if(arExcluderi.includes(numeNutrient))continue;
        let cant_per_suta = Number(Object.values(ob_nutrient)[0].split(' ')[0]);
        if(isNaN(cant_per_suta))cant_per_suta = 0;
        const cantitate_finala = (cantitate_per_portie / 100) * cant_per_suta;
        const val_nutr = Object.values(ob_nutrient)[0].split(' ')[1];
        if(obFin[numeNutrient]){
          obFin[numeNutrient]['cant'] += cantitate_finala;
        }else{
          obFin[numeNutrient] = {};
          obFin[numeNutrient]['cant'] = cantitate_finala;
          obFin[numeNutrient].val = val_nutr;
        }
      }
    }
    return obFin
}
  

function makeArWithString(obMare){
    let arFin = [];
    for(let nutrient of Object.keys(obMare)){
      const numeNutrient = (nutrient[0].toUpperCase() + nutrient.slice(1, nutrient.length)).replace(/_/g, ' ');
      arFin.push(numeNutrient + ' ' + JSON.stringify(obMare[nutrient].cant).slice(0, 4) + ' ' + obMare[nutrient].val) ;
    }
    return arFin;
}

//// <<<<<<<<<=============  editare date raport nutrienti



const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;




export {calcTotalFood, makeArWithString, VisuallyHiddenInput, putParamSetPage, neConectamCuGoogle, punemAltIdInUrl, creamIdConversatie, stergemParamDinUrl, luamIdDinUrl, deruleazaInJos, adresaServer_ai, adresaServer, firebaseConfig, stergemUtilizatorul,  neDeconectam, provider, auth, milisecGreenwich}