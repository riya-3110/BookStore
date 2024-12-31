const admin = require("firebase-admin");
const serviceAccount = require("./creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://crud-node-firebase-30927.firebaseio.com",
});

const db = admin.firestore();
module.exports = { db };
