const sendVerifyMail = require("../utils/emailUtils");
const bcrypt = require("bcrypt");
const User = require('../models/userModel');
const { isSamePassword } = require("../utils/userUtils");

exports.getSignup = (req, res) => {
    if (req.session.verified) {
        res.render("/");
    } else {
        res.render("signup");
    }
};

exports.postSignup = async (req, res) => {
    try {
        let { username, password, email } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        await User.addUser(username,hashed,email);
        await sendVerifyMail(email, username);
        res.redirect("/");
    } catch (e) {
        console.log(e);
        res.status(500).send("Server Error");
    }
};

exports.getCheckId = async (req, res) => {
    const user = await User.getUser({username:req.query.username});
    if (user) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
};

exports.getCheckEmail = async (req, res) => {
    const data = await User.getUser({ email: req.query.email });
    if (data) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
};

exports.getLogin = (req, res) => {
    if (req.session.verified) {
        res.redirect("/");
    } else {
        res.render("login");
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.getUser({username});
        let compared;

        if (user) {
            compared = await isSamePassword(password,user.password);
        }

        if (!user || !compared) {
            res.redirect("/");
        } else {
            req.session.verified = user.verified;
            req.session.username = user.username;
            req.session.uuid = user.uuid;
            res.redirect("/");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Server error");
    }
};

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("로그아웃 실패");
        }
    });
    res.redirect("/");
};

exports.getVerify = async (req, res) => {
    const { username, token } = req.query;
    const user = await User.getUser({username});
    if (user.expires <= new Date()) {
        res.render("emailAuth", { message: "인증 기간 만료됨" });
    } else if (user.verified) {
        res.render("emailAuth", { message: "가입 마저 하러 가셈" });
    } else {
        if (token === user.token) {
            await User.updateUser(username);
            res.render("emailAuth", { message: "인증됨" });
        } else {
            res.render("emailAuth", { message: "인증실패임" });
        }
    }
};

exports.getReverifyMail = (req,res)=>{
    if(req.session.verified){
        res.render('verifyUser',{message:'님 이미 인증 했잖슴'});
    } else{
        res.render('reVerifyMail');
    }
}

exports.postReverifyMail = async (req,res)=>{
    const {username,password} = req.body;
    const user = await User.getUser({username});
    if(user){
        const compared = await isSamePassword(password,user.password);
        if(compared){
            await sendVerifyMail(user.email,username);
            res.render('verifyUser',{message:'재발송했음.'})
        } else{
            res.render('verifyUser',{message:'비밀번호 틀린듯'})
        }
    } else{
        res.render('verifyUser',{message:'없는 유저임'});
    }
}