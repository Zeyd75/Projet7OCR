const db = require("../models");
const Comment = db.comments;
const User = db.users;

exports.create = (req, res, next) => {
  Comment.create(req.body.comment)
    .then(() => res.status(201).json({ message: "Commentaire enregistré !" }))
    .catch((error) => {
      console.log("@@@@@@@@@", error);
      res.status(400).json({ error });
    });
};

exports.update = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAll = (req, res, next) => {
  Comment.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "pseudo"],
      },
    ],
    where: {
      postId: req.params.postId,
    },
  })
    .then((comments) => res.status(200).json(comments))
    .catch((error) => res.status(400).json({ error }));
};
