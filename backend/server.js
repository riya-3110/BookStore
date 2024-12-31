const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { db } = require("./firebase.js");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 5000;
// miidleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

let USER = [];
let BOOKS = [];

const secretKey = "SUPERS3CR3T";

const generateJwt = (username) => {
  const payload = { username: username };
  // console.log("payload:::", payload);
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// const userAuthentication = (req, res, next) => {
//   const { username, password } = req.body;
//   const foundUser = USER.find(
//     (u) => u.username === username && u.password === password
//   );
//   if (foundUser) {
//     next();
//   } else {
//     res.status(403).json({ message: "User authentication failed !" });
//   }
// };

app.post("/signup", async (req, res) => {
  const user = req.body;

  try {
    const usersRef = db.collection("user");
    const querySnapshot = await usersRef
      .where("username", "==", user.username)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      return res.status(400).json({
        message: "Username already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const res2 = await db.collection("user").add({
      username: user.username,
      password: hashedPassword,
    });
    USER.push(user);
    res.json({ message: "User SignUp successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error adding book to Firebase",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const user = req.body;
  try {
    const userRef = db.collection("user");
    const querySnapshot = await userRef
      .where("username", "==", user.username)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(403).json({ message: "Invalid username or password" });
    }

    const userDoc = querySnapshot.docs[0];
    // console.log("userDoc ::" + userDoc);
    const userData = userDoc.data();

    // console.log("userData:::", userData);

    const isPasswordValid = await bcrypt.compare(
      user.password,
      userData.password
    );
    // const isPasswordValid = userData.password == user.password;
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid username or password" });
    }

    const token = generateJwt(userData.username);
    res.status(200).json({ message: "User Login Successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error login to firebase", error: error.message });
  }
});

// ADD books - title, desc, author
app.post("/books", authenticateJwt, async (req, res) => {
  const book = req.body;
  book.id = uuidv4();
  try {
    const res2 = await db.collection("books").doc(book.id).set({
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
    });
    BOOKS.push(book);
    res.json({ message: "Book Added successfully", bookId: book.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book to Firebase", error: error.message });
  }
});

// SHOW book
app.get("/books/:id", authenticateJwt, async (req, res) => {
  const { id } = req.params;
  try {
    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(403).json({ message: "Book NOT FOUND" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({
      message: "Error finding the book in Firebase",
      error: error.message,
    });
  }
});

// SHOW ALL BOOKS
app.get("/books", authenticateJwt, async (req, res) => {
  try {
    const res2 = await db.collection("books").get();
    const books = res2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ AllBooks: books });
  } catch (error) {
    res.status(500).json({
      message: "Error to show books in firebase",
      error: error.message,
    });
  }
});

// UPDATE book
app.put("/books/:id", authenticateJwt, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(403).json({ message: "BOOK NOT FOUND !" });
    }
    await docRef.update(updatedData);
    res.json({ message: "Book Updated Successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating book in firebase",
      error: error.message,
    });
  }
});

// DELETE book
app.delete("/books/:id", authenticateJwt, async (req, res) => {
  const { id } = req.params;
  try {
    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(403).json({ message: "Book Not Found" });
    }
    await docRef.delete();
    res.json({ message: "Book Deleted Successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting book in firebase",
      error: error.message,
    });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "PAGE NOT FOUND" });
});

app.listen(port, () => {
  console.log(`port listening on ${port}`);
});
