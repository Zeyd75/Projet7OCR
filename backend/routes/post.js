const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");
const auth = require("../middleware/auth");

router.get("/", auth.userAuth, postCtrl.getAll);
router.post("/", auth.userAuth, postCtrl.create);
router.get("/getOne/:id", auth.userAuth, postCtrl.getOne);
router.delete("/:id", auth.adminAuth, postCtrl.delete);
router.get("/signal/:id", auth.userAuth, postCtrl.signal);
router.get("/unsignal/:id", auth.adminAuth, postCtrl.unsignal);
router.get("/signaled", auth.adminAuth, postCtrl.getSignaled);

module.exports = router;
