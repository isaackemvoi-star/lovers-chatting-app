import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

export async function signup(email, password, name) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    photo: "",
    status: "Hey there! I am using Lovers Chat",
    lastSeen: Date.now(),
    friends: []
  });
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function googleLogin() {
  return signInWithPopup(auth, googleProvider);
}