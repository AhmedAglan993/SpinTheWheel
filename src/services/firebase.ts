// Firebase Configuration
// Project: spin-the-wheel-spinify

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB0KFOvBuisKMp0DIHgf5TMlr3FTdso0_w",
    authDomain: "spin-the-wheel-spinify.firebaseapp.com",
    projectId: "spin-the-wheel-spinify",
    storageBucket: "spin-the-wheel-spinify.firebasestorage.app",
    messagingSenderId: "268011799280",
    appId: "1:268011799280:web:56b8bdcfce1ef73200b835"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const firebaseAuth = {
    // Email/Password Sign In
    signInWithEmail: async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    },

    // Email/Password Sign Up
    signUpWithEmail: async (email: string, password: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
    },

    // Google Sign In
    signInWithGoogle: async () => {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    },

    // Sign Out
    signOut: async () => {
        await signOut(auth);
    },

    // Get current user
    getCurrentUser: (): User | null => {
        return auth.currentUser;
    },

    // Listen to auth state changes
    onAuthChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    },

    // Get ID token for backend authentication
    getIdToken: async (): Promise<string | null> => {
        const user = auth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
        return null;
    }
};

export { auth };
export type { User };
