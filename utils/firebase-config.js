import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/app'

let config = {
    apiKey: "AIzaSyBHAkanBGLEsh_CedWFUfY95zmc8b9wtXQ",
    authDomain: "todolistrnproject-288120.firebaseapp.com",
    databaseURL: "https://todolistrnproject-288120.firebaseio.com",
    projectId: "todolistrnproject-288120",
    storageBucket: "todolistrnproject-288120.appspot.com",
    messagingSenderId: "1026632069497",
    appId: "1:1026632069497:web:2754a3be203dcd55787fa8",
    measurementId: "G-WNHD39BW6R"
};
let app = firebase.initializeApp(config);
export const database = app.database();
export const auth = app.auth();
export const storage = app.storage()