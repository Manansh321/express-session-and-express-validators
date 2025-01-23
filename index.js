const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const FormDataModel = require("./models/FormData");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

const monogoURI = "mongodb://127.0.0.1:27017/practice_mern";

mongoose
  .connect(monogoURI, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  })
  .then((value) => {
    console.log("Data Base Connected Successfylly");
  })
  .catch((error) => {
    console.log(error);
  });

const store = new MongoDBSession({
  uri: monogoURI,
  collection: "practice_mern",
});

app.use(
  session({
    secret: "key that will sign cookies !",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const isAuth = (req, res, next) =>  {
  if (req.session.isAuth) {
    next();
  }
  else {
    res.redirect('/login')
  }
}

app.get("/", (req, res) => {
  req.session.isAuth = true;
  // console.log(req.session);
  // console.log(req.session.id);
  res.send("hello sessions text");
});


// app.post("/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     // Check if user already exists
//     const existingUser = await FormDataModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Already registered" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create new user with hashed password
//     const newUser = await FormDataModel.create({
//       email,
//       password: hashedPassword
//     });

//     // Respond with the newly created user
//     return res.status(201).json(newUser);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });



app.post("/register", async (req, res) => { 
  // To post / insert data into database

  const { email, password } = req.body;

  let hashedPsw =  bcrypt.hash(password, 12);
  console.log(hashedPsw);  

  await FormDataModel.findOne({ email: email }).then((user) => {
    // finds if there is already a user with this email
    if (user) {
      res.json("Already registered");
    }
     else {
      FormDataModel.create(req.body)
        .then((log_reg_form) => res.json(log_reg_form))
        .catch((err) => res.json(err));
      // new FormDataModel({
      // email,
      // password : hashedPsw
      // });
    }
  });
});

app.post("/login", (req, res) => {
  // To find record from the database
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      // If user found then these 2 cases
      if (user.password === password) { 
            req.session.isAuth = true;
        res.json("Success");
      } else {
        res.json("Wrong password");
      }
    }
    // If user not found then
    else {
      res.json("No records found! ");
    }
  });
});

app.listen(port, () => {
  console.log(`server is listining at : ${port}`);
});

// FormDataModel.create(req.body)
//         .then((log_reg_form) => res.json(log_reg_form))
//         .catch((err) => res.json(err));
