const express = require("express");
const router = express.Router();
const Users = require("./Users");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    let user = await Users.findAll({ raw: true });
    user.forEach((element) => {
      delete element.password;
    });
    res.status(200);
    res.json(user);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;

  if (!isNaN(id)) {
    id = parseInt(id);
    try {
      let user = await Users.findOne({ where: { id: id }, raw: true });
      if (user) {
        delete user.password;
        res.status(200);
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  let { name, email, password } = req.body;

  name = name == undefined || name == null || name == "" ? false : name;
  password =
    password == undefined || password == null || password == ""
      ? false
      : password;
  email = email == undefined || email == null || email == "" ? false : email;

  if (name && email && password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    try {
      await Users.create({ name, email, password: hash });
      res.json({ name, email });
    } catch (error) {}
  } else {
    res.sendStatus(400);
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  if (!isNaN(id)) {
    try {
      let teste = await Users.destroy({ where: { id: id } });
      teste == 1 ? res.sendStatus(200) : res.sendStatus(404);
    } catch (error) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

router.put("/", async (req, res) => {
  let { name, email, password, oldPassword, id } = req.body;

  if (!isNaN(id)) {
    id = parseInt(id);
    try {
      let consultaBanco = await Users.findOne({ where: { id: id }, raw: true });
      if (consultaBanco) {
        let teste = 0;
        if (name) {
          await Users.update({ name }, { where: { id: id } });
          teste = 1;
        }
        if (email) {
          await Users.update({ email }, { where: { id: id } });
          teste = 1;
        }
        if (password) {
          let testePassword = bcrypt.compareSync(
            oldPassword,
            consultaBanco.password,
          );
          if (testePassword) {
            teste = await alteraUser(password);
          }
        }
        teste == 1 ? res.sendStatus(200) : res.sendStatus(400);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
  async function alteraUser(password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    await Users.update({ password: hash }, { where: { id: id } });
    return 1;
  }
});

module.exports = router;
