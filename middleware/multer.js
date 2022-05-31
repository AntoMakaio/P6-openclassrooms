const multer = require("multer");

const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, ajoutFileName(req, file));
  },
});

function ajoutFileName(req, file) {
  const fileName = `${Date.now()}_${file.originalname}`.replace(/\s/g, "_");
  file.fileName = fileName;
  return fileName;
}

const upload = multer({ storage: storage });

module.exports = { upload };
