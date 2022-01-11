const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
//const Op = db.Sequelize.Op;

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hash,
      };
      User.create(user)
        .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findAll({
    where: { email: req.body.email },
  })
    .then((data) => {
      if (!data) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      const user = data[0].dataValues;
      console.log("############", user);
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "MdP incorrect !" });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {
          res.status(501).json({ error });
        });
    })
    .catch((error) => res.status(503).json({ error }));
};
