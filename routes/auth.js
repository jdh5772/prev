const express = require("express");
const router = express.Router();
const {
    getSignup,
    postSignup,
    getCheckId,
    getCheckEmail,
    getLogin,
    postLogin,
    getLogout,
    getVerify,
    getReverifyMail,
    postReverifyMail,
} = require("../controllers/authController");

router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/checkid", getCheckId);
router.get("/checkEmail", getCheckEmail);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/logout", getLogout);
router.get("/verify", getVerify);
router.get("/reVerifyMail", getReverifyMail);
router.post("/reVerifyMail", postReverifyMail);

module.exports = router;
