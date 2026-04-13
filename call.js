import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

export function sendMessage(chatId, user, text) {
  addDoc(collection(db, "messages", chatId, "chat"), {
    sender: user,
    text,
    type: "text",
    status: "sent",
    timestamp: Date.now()
  });
}

export function listenChat(chatId, callback) {
  const q = query(
    collection(db, "messages", chatId, "chat"),
    orderBy("timestamp")
  );

  onSnapshot(q, (snap) => {
    let msgs = [];
    snap.forEach(doc => msgs.push(doc.data()));
    callback(msgs);
  });
}