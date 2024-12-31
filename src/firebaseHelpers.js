import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Function to fetch book details by ID
export const getBookById = async (id) => {
  const bookRef = doc(db, "books", id); // 'books' is the Firestore collection name
  const bookSnap = await getDoc(bookRef);

  if (!bookSnap.exists()) {
    throw new Error("Book not found!");
  }

  return { id: bookSnap.id, ...bookSnap.data() };
};

// Function to update book details by ID
export const updateBookById = async (id, data) => {
  const bookRef = doc(db, "books", id);
  await updateDoc(bookRef, data);
};

// delete book by ID
export const deleteBookById = async (id) => {
  const bookRef = doc(db, "books", id);
  await deleteDoc(bookRef);
};
