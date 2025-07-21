import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD84fjXWuH4gUQC5lpIIAVa1nqQzW6rk0E",
    authDomain: "beautyapp-82a39.firebaseapp.com",
    projectId: "beautyapp-82a39",
    storageBucket: "beautyapp-82a39.firebasestorage.app",
    messagingSenderId: "979432380926",
    appId: "1:979432380926:web:c5f55ea4ebb7926dcac8af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

