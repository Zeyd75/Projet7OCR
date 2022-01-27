const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAll);
router.post("/", postCtrl.create);
router.get("/getOne/:id", postCtrl.getOne);
router.delete("/:id", postCtrl.delete);
router.get("/signal/:id", postCtrl.signal);
router.get("/unsignal/:id", postCtrl.unsignal);
router.get("/signaled", postCtrl.getSignaled);

module.exports = router;
