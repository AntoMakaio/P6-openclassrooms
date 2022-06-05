const jwt = require("jsonwebtoken");

function autentificationUser(req, res, next) {
  const header = req.header("Authorization");
  if (header == null) return res.status(403).send({ message: "invalide" });

  const token = header.split(" ")[1];
  if (token == null) return res.status(403).send({ message: "pas de Token " });

  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Token invalide " + err });
    next();
  });
}

module.exports = { autentificationUser };
