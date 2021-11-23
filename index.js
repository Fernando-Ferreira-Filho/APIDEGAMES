const express = require("express");
const app = express();
const connection = require("./database/Database.js");
const Game = require("./games/Games.js");
const gamesController = require("./games/GamesController");

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

app.listen(8080, () => {
  console.log("API RODANDO");
});
