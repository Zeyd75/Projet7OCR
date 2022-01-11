const db = require("../models");
const Post = db.posts;
const User = db.users;

exports.create = (req, res, next) => {
  Post.create(req.body.post)
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
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

exports.getOne = (req, res, next) => {
  Post.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "pseudo"],
      },
    ],
    where: { id: req.params.id },
  })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Article non trouvé !" });
      }
      const post = data[0].dataValues;
      return res.status(200).json(post);
    })
    .catch((error) => res.status(503).json({ error }));
};

exports.getAll = (req, res, next) => {
  Post.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "pseudo"],
      },
    ],
  })
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

exports.signal = (req, res, next) => {
  Post.update(
    {
      isSignaled: true,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((response) => res.status(200).json(response))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
