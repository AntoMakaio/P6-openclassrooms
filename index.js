const { app, express } = require("./server");
const { saucesRouter } = require("./routes/sauces");
const { auth } = require("./routes/auth");
const bodyParser = require("body-parser");
const port = 3000;
const path = require("path");

/**
 * Connection à la base de donnée
 */
require("./mongoose");

//middleware
app.use(bodyParser.json());
app.use("/api/sauces", saucesRouter);
app.use("/api/auth", auth);

/**
 * Routes
 */
app.get("/", (req, res) => res.send("server port 3000"));

/**
 * écoute
 */
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => console.log("Listening on port" + port));
