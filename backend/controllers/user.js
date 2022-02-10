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
        .then((data) => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//modifier avec un try catch (plus "async-await") qui remplacera les .then
exports.login = (req, res, next) => {
  User.findAll({
    where: { email: req.body.email },
  })
    .then((data) => {
      if (data.length == 0) {
        return res
          .status(401)
          .json({ error: "Utilisateur non trouvé !", code: "wrong_email" });
      }
      const user = data[0].dataValues;
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: "Mot de passe incorrect !",
              code: "wrong_password",
            });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.JWT_SECRET,
              {
                expiresIn: "24h",
              }
            ),
            isAdmin: user.isAdmin,
          });
        })
        .catch((error) => {
          res.status(501).json({ error });
        });
    })
    .catch((error) => {
      res.status(503).json({ error });
    });
};

exports.getUser = (req, res, next) => {
  User.findAll({
    where: { id: req.params.id },
  })
    .then((data) => {
      if (!data) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      const user = data[0].dataValues;
      res.status(200).json(user);
    })
    .catch((error) => res.status(503).json({ error }));
};

exports.update = async (req, res) => {
  try {
    const editProps = {};
    if (req.body.new_password) {
      editProps.password = await bcrypt.hash(req.body.new_password, 10);
    }
    if (req.body.new_email) {
      editProps.email = req.body.new_email;
    }
    if (req.body.new_pseudo) {
      editProps.pseudo = req.body.new_pseudo;
    }
    const userResults = await User.findAll({
      where: { id: req.body.id },
    });
    if (userResults.length == 0) {
      return res
        .status(401)
        .json({ error: "Utilisateur non trouvé !", code: "wrong_email" });
    }
    const user = userResults[0].dataValues;
    console.log("@@@@@@@@@@@@@@@@@", editProps, user);
    const valid = await bcrypt.compare(req.body.old_password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ error: "MdP incorrect !", code: "wrong_password" });
    }
    await User.update(editProps, {
      where: {
        id: req.body.id,
      },
    });
    res.status(201).json({ message: "Profil modifié!" });
  } catch (error) {
    res.status(500).json({ error, message: "Une erreur est survenue" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userResults = await User.findAll({
      where: { id: req.params.id },
    });
    if (userResults.length == 0) {
      return res
        .status(401)
        .json({ error: "Utilisateur non trouvé !", code: "wrong_id" });
    }
    const user = userResults[0].dataValues;
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ error: "MdP incorrect !", code: "wrong_password" });
    }
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => res.status(200).json({ message: "compte supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    res.status(500).json({ error, message: "Une erreur est survenue" });
  }
};
