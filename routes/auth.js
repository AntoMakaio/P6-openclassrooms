const { createUser, logUser } = require("../controllers/users");
const express = require("express");
const auth = express.Router();

auth.post("/signup", createUser);
auth.post("/login", logUser);

module.exports = { auth };
