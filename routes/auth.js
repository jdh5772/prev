const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const smtpTransport = require('../config/email.js');
const crypto = require('crypto');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

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

router.get('/checkid',async (req,res)=>{
    const data = await db.collection('user').findOne({username:req.query.username});
    if(data){
        res.json({exists:true});
    } else{
        res.json({exists:false});
    }
})

router.post('/signup',async (req,res)=>{
    try{
        let {username,password,email} = req.body;
        const hashed = await bcrypt.hash(password,10);
        await db.collection('user').insertOne({username,password:hashed,email});
        await db.collection('tempUser').deleteOne({email});
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

router.get('/mail', async (req, res) => {
    const { token, expires } = generateEmailVerificationToken();
    const email = req.query.email;
    const mailOptions = {
        from: 'moonstne@naver.com',
        to: email,
        subject: '회원가입 인증',
        html: `
        <p> <a href="${BASE_URL}/auth/verify/?email=${email}&token=${token}">이거 누르면 인증됨요</a></p>
        <p>만료일: ${expires}.</p>`
    };

    try {
        const user = await db.collection('user').findOne({email:email});
        const tempData = await db.collection('tempUser').findOne({ email: email });
        if(user){
            return res.json({ok:false,message:'이미 인증된 이메일임'});
        } 

        if(tempData && !tempData.verified){
            if(!tempData.verified){
                await smtpTransport.sendMail(mailOptions);
                await db.collection('tempUser').updateOne({ email: email }, { $set: { token: token, expires: expires } });
                return res.json({ ok: true });
            }
        } else{
            await smtpTransport.sendMail(mailOptions);
            await db.collection('tempUser').insertOne({ email: email, token: token, expires: expires, verified: false });
            return res.json({ ok: true });
        }

    } catch (err) {
        console.error('이메일 전송 실패:', err);
        return res.json({ ok: false, message: '이메일 보내기 실패' });
    }
});

router.get('/verify',async (req,res)=>{
    const {email,token} = req.query;
    const data = await db.collection('tempUser').findOne({email:email});
    if(data.expires<=new Date()){
        res.render('emailAuth',{message:'인증 기간 만료됨'});
    } else if(data.verified){
        res.render('emailAuth',{message:'가입 마저 하러 가셈'});
    } else{
        if(token === data.token){
            await db.collection('tempUser').updateOne({email:email},{$set:{verified:true}});
            res.render('emailAuth',{message:'인증됨'});
        } else{
            res.render('emailAuth',{message:'인증실패임'});
        }
    }
})

router.get('/checkVerify',async (req,res)=>{
    const data = await db.collection('tempUser').findOne({email:req.query.email});
    if(data && data.verified){
        res.json({verified:true});
    } else{
        res.json({verified:false});
    }
})

module.exports = router;