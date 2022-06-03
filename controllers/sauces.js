const mongoose = require("mongoose");
const { unlink } = require("fs/promises");

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});

const Product = mongoose.model("Product", productSchema);

function getSauces(req, res) {
  Product.find({})
    .then((products) => res.send(products))
    .catch((err) => res.status(500).send(err));
}

function getSauce(req, res) {
  const { id } = req.params;
  return Product.findById(id);
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => updateData(product, res))
    .catch((err) => res.status(500).send(err));
}

function suppressionSauce(req, res) {
  const { id } = req.params;
  // envoi suppression produit à la BDD
  Product.findByIdAndDelete(id)
    //je supprime l'image
    .then((product) => updateData(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("Image supprimée", res))
    .catch((err) => res.status(500).send({ message: err }));
}

function modificationSauce(req, res) {
  const {
    params: { id },
  } = req;

  console.log("req.file", req.file);

  const nouvelleImage = req.file != null;
  const payload = ajoutPayload(nouvelleImage, req);

  Product.findByIdAndUpdate(id, payload)
    .then((resDataBase) => updateData(resDataBase, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("Image supprimée", res))
    .catch((err) => console.error("problème de mise à jour", err));
}

function deleteImage(product) {
  if (product == null) return;
  console.log(product);
  const imageAsupprimer = product.imageUrl.split("/").at(-1);
  return unlink("images/" + imageAsupprimer);
}

function ajoutPayload(nouvelleImage, req) {
  console.log("nouvelle image", nouvelleImage);
  if (!nouvelleImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = ajoutImageUrl(req, req.file.fileName);
  console.log("payload:", payload);
  return payload;
}

function updateData(product, res) {
  if (product == null) {
    return res
      .status(404)
      .send({ message: "Sauce non trouvé dans la base de donnée" });
  }
  return Promise.resolve(res.status(200).send(product)).then(() => product);
}

function ajoutImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

function createSauce(req, res) {
  const { body, file } = req;
  const sauce = JSON.parse(body.sauce);
  const { fileName } = file;
  const name = sauce.name;
  const manufacturer = sauce.manufacturer;
  const description = sauce.description;
  const mainPepper = sauce.mainPepper;
  const heat = sauce.heat;
  const userId = sauce.userId;

  const product = new Product({
    name: name,
    userId: userId,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: ajoutImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((message) => res.status(201).send({ message }))
    .catch((err) => res.status(500).send(err));
}

function likeSauce(req, res) {
  const { like, userId } = req.body;

  if (![0, 1, -1].includes(like))
    return res.status(403).send({ message: "like valeur invalide" });

  getSauce(req, res)
    .then((product) => updateLike(product, like, userId, res))
    .then((sauce) => sauce.save())
    .then((prod) => updateData(prod, res))
    .catch((err) => res.status(500).send(err));
}

function updateLike(product, like, userId, res) {
  if (like === 1 || like === -1) return incrementLike(product, userId, like);
  return resetLike(product, userId, res);
}

function resetLike(product, userId, res) {
  const { usersLiked, usersDisliked } = product;
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("Double vote");

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject("pas de vote");
  console.log("init");

  if (usersLiked.includes(userId)) {
    console.log("test 1");

    --product.likes;
    product.usersLiked = product.usersLiked.filter((id) => id !== userId);
  } else {
    console.log("test");
    --product.dislikes;
    product.usersDisliked = product.usersDisliked.filter((id) => id !== userId);
  }
  return product;
}

function incrementLike(product, userId, like) {
  const { usersLiked, usersDisliked } = product;

  const arrayLike = like === 1 ? usersLiked : usersDisliked;
  console.log("usersDisliked:", usersDisliked);
  console.log("arrayLike:", arrayLike);
  if (arrayLike.includes(userId)) return product;
  arrayLike.push(userId);

  like === 1 ? ++product.likes : ++product.dislikes;

  return product;
}

module.exports = {
  getSauces,
  createSauce,
  getSauceById,
  suppressionSauce,
  modificationSauce,
  likeSauce,
};
