const express = require("express");
const router = express.Router();
const {
    getList,
    getWrite,
    postWrite,
    getDetail,
    getEdit,
    postEdit,
    deletePost,
    addComments,
} = require("../controllers/listController");

router.get("/", getList);
router.get("/write", getWrite);
router.post("/write", postWrite);
router.get("/detail/:id", getDetail);
router.get("/edit/:id", getEdit);
router.post("/edit/:id", postEdit);
router.delete("/delete/:id", deletePost);
router.post("/comments", addComments);

module.exports = router;
