import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBrWlJYKPh7_7yT0jlQYxzF9k1CGpPLgaU",
    authDomain: "instagram-clone-react-sk.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-sk.firebaseio.com",
    projectId: "instagram-clone-react-sk",
    storageBucket: "instagram-clone-react-sk.appspot.com",
    messagingSenderId: "12681309376",
    appId: "1:12681309376:web:93307da943739ca56f1125",
    measurementId: "G-JXSC67Z0FD"
});
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const messaging = firebase.messaging();

export { db, auth, storage, messaging, timestamp};