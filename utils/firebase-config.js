import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/app'

let config = {
    apiKey: "AIzaSyAcgv_a5ClfpAvuPoCVyTEWUGQTgfxIUME",
    authDomain: "todolistrnproject.firebaseapp.com",
    databaseURL: "https://todolistrnproject.firebaseio.com",
    projectId: "todolistrnproject",
    storageBucket: "todolistrnproject.appspot.com",
    messagingSenderId: "70135314811",
    appId: "1:70135314811:web:7df887f4de21004121e5de",
    measurementId: "G-BL52GDDQCE"
};
let app = firebase.initializeApp(config);
export const database = app.database();
export const auth = app.auth();