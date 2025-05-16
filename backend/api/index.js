const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const serverlessExpress = require("@vendia/serverless-express"); // OPRAVA TU
const UserTable = require("./users_table");

const FRONTEND = process.env.NEXT_FRONTEND;
const URI = process.env.NEXT_PUBLIC_API_URL;

const server = express();

server.use(
  cors({
    origin: FRONTEND,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);

server.use(express.json());
server.use(cookieParser());

mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const createToken = (payload) => {
  return jwt.sign({ data: payload }, "mhjekral", { expiresIn: "1d" });
};

server.get("/", (req, res) => {
  res.send("Backend is running!");
});

server.post("/registration", async (req, res) => {
  const { name, surname, email, password } = req.body;
  const existing = await UserTable.findOne({ email });

  if (existing) {
    return res.status(400).json("Používateľ už existuje");
  }

  const hashedPassword = await bcrypt.hash(password, 10); // OPRAVA TU
  const user = await UserTable.create({
    name,
    surname,
    email,
    password: hashedPassword,
  });

  res.status(200).json("Úspešne zaregistrovaný");
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserTable.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = createToken({
      name: user.name,
      surname: user.surname,
      email: user.email,
    });

    res.cookie("user", token, { maxAge: 86400000, httpOnly: true });
    res.status(200).json("Úspešné prihlásenie");
  } else {
    res.status(400).json("Zlý email alebo heslo");
  }
});

server.post("/addPayer", async (req, res) => {
  try {
    const { email } = req.body;
    const updated = await UserTable.findOneAndUpdate(
      { email },
      { isPayer: true },
      { new: true }
    );
    res.status(200).json("Pridaný nový dlžník");
  } catch (error) {
    console.error(error);
    res.status(500).json("Chyba pri pridávaní dlžníka");
  }
});

server.post("/addToDept", async (req, res) => {
  try {
    const { id, NewAmount } = req.body;
    await UserTable.findByIdAndUpdate(id, { dept: NewAmount });
    res.status(200).json("Dlžoba aktualizovaná");
  } catch (error) {
    console.error(error);
    res.status(500).json("Chyba pri aktualizácii dlžoby");
  }
});

server.get("/getuser", async (req, res) => {
  try {
    const token = req.cookies.user;
    const decoded = jwt.verify(token, "mhjekral");
    res.status(200).json(decoded.data);
  } catch (error) {
    console.error(error);
    res.status(401).json("Neplatný token");
  }
});

server.get("/getusers", async (req, res) => {
  try {
    const users = await UserTable.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json("Chyba pri načítaní používateľov");
  }
});

module.exports = serverlessExpress({ app: server });
