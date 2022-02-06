const jwt = require("jsonwebtoken");

exports.userAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User Id non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée !" });
  }
};

exports.adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    console.log(decodedToken.isAdmin, "##################");
    if (req.body.userId && req.body.userId !== userId) {
      throw "User Id non valable !";
    } else if (!decodedToken.isAdmin) {
      throw "Vous ne disposez pas des droits d'administration !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée !" });
  }
};
