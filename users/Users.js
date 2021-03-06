const Sequelize = require("sequelize");
const connection = require("../database/Database");

const Users = connection.define("users", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Users.sync({ force: true });

module.exports = Users;
