const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAll);
router.post("/", postCtrl.create);
router.get("/signal/:id", postCtrl.signal);
router.get("/:id", postCtrl.getOne);
router.put("/:id", postCtrl.update);
router.delete("/:id", postCtrl.delete);

module.exports = router;
