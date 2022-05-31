const express = require("express");
const {
  getSauces,
  createSauce,
  getSauceById,
  suppressionSauce,
  modificationSauce,
  likeSauce,
} = require("../controllers/sauces");
const { autentificationUser } = require("../middleware/auth");
const { upload } = require("../middleware/multer");
const saucesRouter = express.Router();
const bodyParser = require("body-parser");

saucesRouter.use(bodyParser.json());

saucesRouter.get("/", autentificationUser, getSauces);
saucesRouter.post(
  "/",
  autentificationUser,
  upload.single("image"),
  createSauce
);
saucesRouter.get("/:id", autentificationUser, getSauceById);
saucesRouter.delete("/:id", autentificationUser, suppressionSauce);
saucesRouter.put(
  "/:id",
  autentificationUser,
  upload.single("image"),
  modificationSauce
);
saucesRouter.post("/:id/like", autentificationUser, likeSauce);

module.exports = { saucesRouter };
