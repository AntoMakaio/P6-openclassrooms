const { User } = require("../mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 *
 * @param {object} req
 * @param {object} res
 */
async function createUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "Vous êtes enregistré, Félicitations !" });
  } catch (error) {
    res.status(409).send({ message: "Utilisateur pas enregistré :" + error });
  }
}

/**
 *
 * @param {string} password
 * @returns
 */
function hashPassword(password) {
  //nombre d'itération
  const sel = 10;
  return bcrypt.hash(password, sel);
}

async function logUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      res.status(403).send({ message: "Mot de passe incorrect" });
    }
    const token = createToken(email);
    res.status(200).send({ userId: user?._id, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur interne" });
  }
}

/**
 *
 * @param {*} email
 * @returns
 */
function createToken(email) {
  const jwtPassword = process.env.JWT_PASSWORD;
  return jwt.sign({ email: email }, jwtPassword, {
    expiresIn: "24h",
  });
}

module.exports = { createUser, logUser };
