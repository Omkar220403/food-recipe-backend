const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
app.use(express.json());

const mongoUrl =
  "mongodb+srv://admin:admin@cluster0.nbvn1z6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch(e => {
    console.log(e);
  });

require("./UserDetails");
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "started" });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ data: "User already exists!!" });
  }

  const encryptedPassword = await bcryptjs.hash(password, 10);
  try {
    await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: "error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.send({ status: "error", data: "User not found" });
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (isPasswordValid) {
    res.send({ status: "ok", data: "Login successful" });
  } else {
    res.send({ status: "error", data: "Invalid credentials" });
  }
});

app.listen(5001, () => {
  console.log("Node js server is started");
});
