const db = require("../models");
const Post = db.posts;
const User = db.users;

exports.create = (req, res, next) => {
  Post.create(req.body.post)
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
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

exports.getSignaled = (req, res, next) => {
  Post.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "pseudo"],
      },
    ],
    where: { isSignaled: true },
  })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Aucun post signalé!" });
      }
      const posts = data.map((item) => item.dataValues);
      return res.status(200).json(posts);
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

exports.delete = (req, res, next) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(200).json({ message: "post supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.signal = (req, res) => {
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
    .then(() => res.status(201).json({ message: "Signalement confirmé!" }))
    .catch((error) =>
      res.status(500).json({ error, message: "Une erreur est survenue" })
    );
};

exports.unsignal = (req, res) => {
  Post.update(
    {
      isSignaled: false,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then(() => res.status(201).json({ message: "Signalement annulé!" }))
    .catch((error) =>
      res.status(500).json({ error, message: "Une erreur est survenue" })
    );
};
