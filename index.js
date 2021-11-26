const express = require("express");
const app = express();
const connection = require("./database/Database.js");
const Game = require("./games/Games.js");
const User = require("./users/Users.js");
const gamesController = require("./games/GamesController");
const usersController = require("./users/UsersController.js");

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

app.listen(8080, () => {
  console.log("API RODANDO");
});
