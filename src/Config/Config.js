import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAkE7kURW8mVNQYjvByZ3JVCt8xMNb-lxw",
  authDomain: "crazybillz-9720e.firebaseapp.com",
  projectId: "crazybillz-9720e",
  storageBucket: "crazybillz-9720e.appspot.com",
  messagingSenderId: "544683265246",
  appId: "1:544683265246:web:6a70c1e89ffadb70ee864f",
  measurementId: "G-BW2JR2PFET"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

//created exportable variables to use instead of functions
export {auth,fs,storage}