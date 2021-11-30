const express = require("express");
const router = express.Router();
const Game = require("../games/Games");
const auth = require("../middleware/middleware");

router.get("/", auth, async (req, res) => {
  const games = await Game.findAll();

  res.status(200);
  res.json({ user: req.loggedUser, games });
});

router.get("/:id", auth, async (req, res) => {
  let id = req.params.id;
  let game = "";

  if (!isNaN(id)) {
    id = parseInt(id);
    game = await Game.findOne({ where: { id: id } });

    switch (game) {
      case null:
        res.sendStatus(404);
        break;
      default:
        res.json(game);
        res.status(200);
        break;
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/", auth, async (reqauth, res) => {
  const { title, year, price } = req.body;
  let create;
  if (
    title == undefined ||
    (year == undefined && !isNaN(year)) ||
    (price == undefined && !isNaN(price))
  ) {
    res.sendStatus(400);
  } else {
    try {
      create = await Game.create({ title, year, price });
      res.json(create.dataValues);
      res.status(200);
    } catch (err) {
      res.sendStatus(500);
    }
  }
});

router.delete("/:id", auth, async (req, res) => {
  let id = req.params.id;
  let destroy;
  if (!isNaN(id)) {
    id = parseInt(id);
    try {
      destroy = await Game.destroy({ where: { id: id } });
      if (destroy == 1) {
        res.sendStatus(200);
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

router.put("/:id", auth, async (req, res) => {
  let id = req.params.id;

  if (!isNaN(id)) {
    let { title, year, price } = req.body;
    id = parseInt(id);
    year = parseInt(year);
    price = parseFloat(price);
    let teste = 0;
    try {
      let consultaBanco = await Game.findOne({ where: { id } });
      if (consultaBanco) {
        if (title != undefined) {
          await Game.update({ title }, { where: { id: id } });
          teste = 1;
        }
        if (year != undefined && !isNaN(year)) {
          await Game.update({ year }, { where: { id: id } });
          teste = 1;
        }
        if (price != undefined && !isNaN(price)) {
          await Game.update({ price }, { where: { id: id } });
          teste = 1;
        }
      }
      teste == 1 ? res.sendStatus(200) : res.sendStatus(400);
    } catch (error) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
