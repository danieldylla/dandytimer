// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';

// Initalize and export Firebase.
const config = {
  apiKey: "AIzaSyBQ8dnvJkM6-Pa7aqCjCiOPKJ23UjU0Z9A",
  authDomain: "dandytimer.firebaseapp.com",
  databaseURL: "https://dandytimer.firebaseio.com",
  projectId: "dandytimer",
  storageBucket: "dandytimer.appspot.com",
  messagingSenderId: "761979688892"
};
export default firebase.initializeApp(config);
