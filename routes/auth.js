const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const sendVerifyMail = require('../utils/emailUtils');
const { v4: uuidv4 } = require('uuid');

let db;
connectDB
.then(client=>{
    db = client.db('forum');
})

router.get('/signup',(req,res)=>{
    if(req.session.verified){
        res.render('/');
    } else{
        res.render('signup');
    }
})

router.post('/signup',async (req,res)=>{
    try{
        let {username,password,email} = req.body;
        const uuid = uuidv4();
        const hashed = await bcrypt.hash(password,10);
        await db.collection('user').insertOne({username,password:hashed,email,verified:false,uuid});
        await sendVerifyMail(email,username);
        req.session.id = await db.collection('user').findOne({username})._id;
        req.session.username = username;
        req.session.verified = false;
        res.redirect('/');
    }
    catch(e){
        console.log(e);
        res.status(500).send('Server Error');
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

router.get('/checkEmail',async (req,res)=>{
    const data = await db.collection('user').findOne({email:req.query.email});
    if(data){
        res.json({exists:true});
    } else{
        res.json({exists:false});
    }
})



router.get('/login',(req,res)=>{
    if(req.session.verified){
        res.redirect('/');
    } else{
        res.render('login');
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await db.collection('user').findOne({username});
        let compared ;
        
        if(user){
            compared = await bcrypt.compare(password,user.password);
        }

        if(!user || !compared){
            res.redirect('/');
        } else{
            req.session.verified = user.verified;
            req.session.username = user.username;
            req.session.uuid = user.uuid;
            res.redirect('/');
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send('Server error');
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


router.get('/verify',async (req,res)=>{
    const {username,token} = req.query;
    const data = await db.collection('user').findOne({username});
    if(data.expires<=new Date()){
        res.render('emailAuth',{message:'인증 기간 만료됨'});
    } else if(data.verified){
        res.render('emailAuth',{message:'가입 마저 하러 가셈'});
    } else{
        if(token === data.token){
            await db.collection('user').updateOne({username},{$set:{verified:true}});
            res.render('emailAuth',{message:'인증됨'});
        } else{
            res.render('emailAuth',{message:'인증실패임'});
        }
    }
})

router.get('/reVerifyMail',(req,res)=>{
    if(req.session.verified){
        res.render('verifyUser',{message:'님 이미 인증 했잖슴'});
    } else{
        res.render('reVerifyMail');
    }
})

router.post('/reVerifyMail',async (req,res)=>{
    const {username,password} = req.body;
    const user = await db.collection('user').findOne({username});
    if(user){
        const compared = await bcrypt.compare(password,user.password);
        if(compared){
            await sendVerifyMail(user.email,username);
            res.render('verifyUser',{message:'재발송했음.'})
        } else{
            res.render('verifyUser',{message:'비밀번호 틀린듯'})
        }
    } else{
        res.render('verifyUser',{message:'없는 유저임'});
    }
})

module.exports = router;