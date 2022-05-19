const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.post("/api/auth/signup", (req, res) => {
  console.log("Signup request:", req.body);
  res.send({ message: "Vous êtes enregistré, Félicitations !" });
});

app.get("/", (req, res) => {
  res.send("hello word");
});

app.listen(port, () => console.log("Listening on port" + port));
