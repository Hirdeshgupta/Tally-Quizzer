const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
require("dotenv").config();

// Bodyparser middleware
app.use(express.json());
app.use(cors());

// database configs
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyC0qLIcHt1aDuuv4775zMAzWK8yrAF4ihE",
  databaseURL: "https://tally-quizzer-default-rtdb.firebaseio.com/",
  authDomain: "tally-quizzer.firebaseapp.com",
  projectId: "tally-quizzer",
  storageBucket: "tally-quizzer.appspot.com",
  messagingSenderId: "971043272370",
  appId: "1:971043272370:web:d87240d75982cf8f25fbab",
  measurementId: "G-JEL8SSX5V4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
dbRef = db.ref();

app.set("db", db);

// use routes
app.use("/api/status", require("./routes/status"));
app.use("/api/allData", require("./routes/getalldata"));
app.use("/api/create", require("./routes/createschema"));
app.use("/api/saveQues", require("./routes/saveQues"));
app.use("/api/getQues", require("./routes/getallQues"));

// serve static assets if we are in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.use(express.static("public"));
}

const port = process.env.BACKEND_NODE_PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}`));
