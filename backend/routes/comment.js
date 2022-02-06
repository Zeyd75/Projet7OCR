const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");

router.get("/getAll/:postId", auth.userAuth, commentCtrl.getAll);
router.post("/", auth.userAuth, commentCtrl.create);
router.get("/getOne/:id", auth.userAuth, commentCtrl.getOne);
router.delete("/:id", auth.adminAuth, commentCtrl.delete);
router.get("/signal/:id", auth.userAuth, commentCtrl.signal);
router.get("/unsignal/:id", auth.adminAuth, commentCtrl.unsignal);
router.get("/signaled", auth.adminAuth, commentCtrl.getSignaled);

module.exports = router;
