import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBaxCraJCHku0-z_VvcezZyh_DqHJfeHeA",
    authDomain: "picbit-190b3.firebaseapp.com",
    databaseURL: "https://picbit-190b3.firebaseio.com",
    projectId: "picbit-190b3",
    storageBucket: "picbit-190b3.appspot.com",
    messagingSenderId: "165150152796",
    appId: "1:165150152796:web:18815db9e2f85e502dae99",
    measurementId: "G-96WWKFSHJW"
})
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db, auth, storage};
  