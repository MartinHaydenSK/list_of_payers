const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const serverlessExpress = require("@vendia/serverless-express");
const UserTable = require("./users_table");
const FRONTEND = process.env.NEXT_FRONTEND;
const server = express();
module.exports = serverlessExpress({ server });

server.use(
  cors({
    origin: `${FRONTEND}`,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);
server.use(express.json());
server.use(cookieParser());

const URI = process.env.NEXT_PUBLIC_API_URL;

mongoose.connect(URI);

console.log("everything is working");

const createToken = (payload) => {
  return jwt.sign({ data: payload }, "mhjekral", { expiresIn: "1d" });
};

server.get("/", (req, res) => {
  res.send("everything is working");
});

server.post("/registration", async (req, res) => {
  console.log("called");
  const { name, surname, email, password } = req.body;
  const findUser = await UserTable.findOne({ email });
  if (findUser) {
    res.status(400).json("Použivateľ už existuje");
  } else {
    const createUser = await UserTable.create({
      name,
      surname,
      email,
      password,
    });
    if (createUser) {
      res.status(200).json("Boli ste úspešne zaregistorvaný");
    }
  }
});

server.post("/login", async (req, res) => {
  console.log("called");
  const { email, password } = req.body;
  console.log(req.body);
  const findUser = await UserTable.findOne({ email });
  if (findUser) {
    console.log(findUser, "hello");
    const comparison = await bcrypt.compare(password, findUser.password);

    if (comparison) {
      const name = findUser.name;
      const surname = findUser.surname;
      const email = findUser.email;
      const payload = { name, surname, email };
      const token = createToken(payload);
      res.cookie("user", token, { maxAge: 24 * 60 * 60 * 1000 });
      res.status(200).json("Úspešene ste sa prihlásili");
    } else {
      res.status(200).json("Zlý email alebo heslo");
    }
  } else {
    console.log("called two");
    res.status(200).json("Zlý email alebo heslo");
  }
});

server.post("/addPayer", async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await UserTable.findOneAndUpdate(
      { email },
      { isPayer: true },
      { new: true }
    );
    if (findUser) {
      console.log(findUser);
      res.status(200).json("Pridaný nový dlžník");
    }
  } catch (error) {
    console.log(error, "/addPayer");
  }
});

server.post("/addToDept", async (req, res) => {
  const { id, NewAmount } = req.body;
  console.log("fired", req.body);
  try {
    const findUser = await UserTable.findOneAndUpdate(
      {
        _id: id,
      },
      { dept: NewAmount },
      { new: true }
    );

    if (findUser) {
      res.status(200).json("Úspešne bola pridaná hodnota");
    }
  } catch (error) {
    console.log(error, "/addToDept");
  }
});
server.get("/getuser", async (req, res) => {
  try {
    const token = req.cookies.user;
    const decodedToken = jwt.verify(token, "mhjekral");

    if (decodedToken) {
      res.status(200).json(decodedToken.data);
    }
  } catch (error) {
    console.log(error, "/getuser");
  }
});

server.get("/getusers", async (req, res) => {
  try {
    const findUsers = await UserTable.find();
    if (findUsers) {
      res.status(200).json(findUsers);
    }
  } catch (error) {
    console.log(error, "/getusers");
  }
});
