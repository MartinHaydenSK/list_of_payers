const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const UserTable = require("./users_table");
const RecordTable = require("./reports_table");
const FRONTEND = process.env.NEXT_FRONTEND;
const serverless = require("serverless-http");
const app = express();

app.use(
  cors({
    origin: `${FRONTEND}`,
    credentials: true,
  })
);
// allowedHeaders: "Content-Type, Authorization",
app.use(express.json());
app.use(cookieParser());

const URI = process.env.NEXT_PUBLIC_API_URL;

mongoose.connect(URI);

const createToken = (payload) => {
  return jwt.sign({ data: payload }, "mhjekral", { expiresIn: "1d" });
};

app.get("/", (req, res) => {
  res.send("everything is working");
});

app.post("/registration", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const findUser = await UserTable.findOne({ email });
  if (findUser) {
    const comparison = await bcrypt.compare(password, findUser.password);

    if (comparison) {
      const name = findUser.name;
      const surname = findUser.surname;
      const email = findUser.email;
      const payload = { name, surname, email };
      const token = createToken(payload);
      res.cookie("user", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.status(200).json("Úspešene ste sa prihlásili");
    } else {
      res.status(200).json("Zlý email alebo heslo");
    }
  } else {
    res.status(200).json("Zlý email alebo heslo");
  }
});

app.post("/addPayer", async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await UserTable.findOneAndUpdate(
      { email },
      { isPayer: true },
      { new: true }
    );
    if (findUser) {
      res.status(200).json("Pridaný nový dlžník");
    }
  } catch (error) {
    console.log(error, "/addPayer");
  }
});

app.post("/addToDept", async (req, res) => {
  const { id, NewAmount } = req.body;

  try {
    const findUser = await UserTable.findOneAndUpdate(
      {
        _id: id,
      },
      { dept: NewAmount },
      { new: true }
    );
    await RecordTable.create({
      date: new Date(),
      amount: NewAmount,
      user: id,
    });

    if (findUser) {
      res.status(200).json("Úspešne bola pridaná hodnota");
    }
  } catch (error) {
    console.log(error, "/addToDept");
  }
});
app.get("/getuser", async (req, res) => {
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

app.get("/getusers", async (req, res) => {
  try {
    const findUsers = await UserTable.find();
    if (findUsers) {
      res.status(200).json(findUsers);
    }
  } catch (error) {
    console.log(error, "/getusers");
  }
});

app.listen(3000);
