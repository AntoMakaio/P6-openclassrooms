const jwt = require("jsonwebtoken");

function autentificationUser(req, res, next) {
  // console.log("autentification utilisateur");
  const header = req.header("Authorization");
  if (header == null) return res.status(403).send({ message: "invalid" });

  const token = header.split(" ")[1];
  if (token == null)
    return res.status(403).send({ message: "Token cannot be " });

  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Token invalid " + err });
    // console.log("token valide");
    next();
  });
}

module.exports = { autentificationUser };
