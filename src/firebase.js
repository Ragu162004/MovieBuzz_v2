import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAxML9t-7z-AXpxbiMogBmnGlDPmVj42QE",
    authDomain: "movie-recommendation-82ec7.firebaseapp.com",
    projectId: "movie-recommendation-82ec7",
    storageBucket: "movie-recommendation-82ec7.firebasestorage.app",
    messagingSenderId: "134201444274",
    appId: "1:134201444274:web:2738f20fdb5ec2a4ebc6ab",
    measurementId: "G-K5BCHM4DVV"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;