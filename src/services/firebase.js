import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7KVrB3cv6zYO-N_HLHE7sPXhwSyKRplE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prepmate-ai-7f5f8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prepmate-ai-7f5f8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prepmate-ai-7f5f8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "158983181148",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:158983181148:web:63dcffa32aa4478c40a799",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-L2LG0SLDR4"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signOutUser() {
  return fbSignOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

export { auth }
