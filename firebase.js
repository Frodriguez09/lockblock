// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2Na9lrh6rl26v4OUmeoUUtDuMI67Eo6Q",
  authDomain: "lockblock-25577.firebaseapp.com",
  projectId: "lockblock-25577",
  storageBucket: "lockblock-25577.appspot.com",
  messagingSenderId: "312481526600",
  appId: "1:312481526600:web:3944a8d5c8587010ed397d"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth()

export {auth};
