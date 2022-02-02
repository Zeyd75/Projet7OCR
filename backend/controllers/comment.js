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

exports.delete = (req, res, next) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(200).json({ message: "commentaire supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Test
exports.getOne = (req, res, next) => {
  Comment.findAll({
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
        return res.status(404).json({ error: "Commentaire non trouvé !" });
      }
      const comment = data[0].dataValues;
      return res.status(200).json(comment);
    })
    .catch((error) => res.status(503).json({ error }));
};

exports.signal = (req, res) => {
  Comment.update(
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
  Comment.update(
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

exports.getSignaled = (req, res, next) => {
  Comment.findAll({
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
        return res.status(404).json({ error: "Aucun commentaire signalé !" });
      }
      const comments = data.map((item) => item.dataValues);
      return res.status(200).json(comments);
    })
    .catch((error) => res.status(503).json({ error }));
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
