const jwt = require("jsonwebtoken");
const jwtSecret = "fljçdjçajlçjfaçsljfieokfljdilajsfa486548@@@#!#%";


async function auth(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const bearer = authToken.split(" ");
    let token = bearer[1];
    let validation = jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.status(401);
        res.json({ err: "Token Invalido" });
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        res.status(200);
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ err: " Token Invalido" });
  }
}

module.exports = auth;
