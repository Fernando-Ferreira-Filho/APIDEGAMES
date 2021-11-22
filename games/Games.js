const Sequelize = require("sequelize");
const connection = require("../database/Database");

const Game = connection.define("game", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

// Game.sync({ force: true });

module.exports = Game;
