import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZtgokvIZWwL3lngVJGNryFuLC2WHEx5A",
  authDomain: "pulseai-assistant.firebaseapp.com",
  projectId: "pulseai-assistant",
  storageBucket: "pulseai-assistant.firebasestorage.app",
  messagingSenderId: "554003431534",
  appId: "1:554003431534:web:cb2dad8ed976fa53bfa67f",
  measurementId: "G-3E6FZLS0DN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
