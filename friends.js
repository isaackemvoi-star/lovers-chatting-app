import { db } from "./firebase.js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function addFriend(userId, friendId) {
  await updateDoc(doc(db, "users", userId), {
    friends: arrayUnion(friendId)
  });
}