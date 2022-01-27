const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/comment");

router.get("/:postId", commentCtrl.getAll);
router.post("/", commentCtrl.create);
//Test
router.get("/getOne/:id", commentCtrl.getOne);
router.delete("/:id", commentCtrl.delete);
router.get("/signal/:id", commentCtrl.signal);
router.get("/unsignal/:id", commentCtrl.unsignal);
router.get("/signaled", commentCtrl.getSignaled);

module.exports = router;
