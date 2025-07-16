import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxr8JlYe3PqYal4d81LDTk-St8pdbfLCo",
  authDomain: "elha-6d1d7.firebaseapp.com",
  projectId: "elha-6d1d7",
  storageBucket: "elha-6d1d7.appspot.com",
  messagingSenderId: "848849825817",
  appId: "1:848849825817:web:253ab23cc97b9425577a88",
  measurementId: "G-H0ML4GCC4Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
};

