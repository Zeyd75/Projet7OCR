const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/getUser/:id", auth.userAuth, userCtrl.getUser);
router.post("/update", auth.userAuth, userCtrl.update);
router.post("/delete/:id", auth.userAuth, userCtrl.delete);

module.exports = router;
