const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const smtpTransport = require('../config/email.js');
const crypto = require('crypto');

const generateEmailVerificationToken = ()=>{
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours()+24);
    return {token,expires};
}

let db;
connectDB
.then(client=>{
    db = client.db('forum');
})

router.get('/signup',(req,res)=>{
    if(req.session.username){
        res.render('/');
    } else{
        res.render('signup',{username:req.session.username});
    }
})

router.post('/checkid',async (req,res)=>{
    const data = await db.collection('user').findOne({username:req.body.username});
    if(data){
        res.json({exists:true});
    } else{
        res.json({exists:false});
    }
})

router.post('/signup',async (req,res)=>{
    try{
        let {username,password} = req.body;
        const hashed = await bcrypt.hash(password,10);
        await db.collection('user').insertOne({username,password:hashed});
        req.session.username = username;
        res.redirect('/');
    }
    catch(e){
        console.log(e);
        res.status(500).send('Server Error');
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send('로그아웃 실패');
        }
    })
    res.redirect('/');
})

router.get('/login',(req,res)=>{
    if(req.session.username){
        res.redirect('/');
    } else{
        res.render('login',{username:req.session.username});
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await db.collection('user').findOne({username:username});
        const compared = await bcrypt.compare(password,user.password);

        if(!user || !compared){
            res.redirect('/auth/login');
        } else{
            req.session.username = username;
            res.redirect('/');
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send('Server error');
    }
})

router.get('/mail',(req,res)=>{
    const result = generateEmailVerificationToken();

    const email = 'moonstne@naver.com';
    const mailOptions = {
        from:'moonstne@naver.com',
        to: email,
        subject : '회원가입 인증',
        html: `
        <p> <a href="http://localhost:3000/verify-email/?email=${email}?token=${result.token}">이거 누르면 인증됨요</a></p>
        <p>만료일: ${result.expires}.</p>`
    }

    smtpTransport.sendMail(mailOptions, (err, response) => {
        if(err) {
            res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
            smtpTransport.close() //전송종료
            return ;
        } else {
            res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : number})
            smtpTransport.close() //전송종료
            return ;

        }
    })
})

module.exports = router;