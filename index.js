const express = require("express");
const app = express();
const connection = require("./database/Database.js");
const Game = require("./games/Games.js");
const User = require("./users/Users.js");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/middleware");

const gamesController = require("./games/GamesController");
const usersController = require("./users/UsersController.js");

const jwtSecret = "fljçdjçajlçjfaçsljfieokfljdilajsfa486548@@@#!#%";

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection
  .authenticate()
  .then(() => {
    console.log("conectou");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/games", gamesController);
app.use("/users", usersController);

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ where: { email }, raw: true });
    if (user) {
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (comparePassword) {
        jwt.sign(
          { email: user.email, id: user.id },
          jwtSecret,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.status(200);
              res.json(token);
            }
          },
        );
      } else {
        res.status(401);
        res.json({ err: "senha Invalida" });
      }
    } else {
      res.status(404);
      res.json({ err: "email Invalida" });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(8080, () => {
  console.log("API RODANDO");
});
