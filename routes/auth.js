const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');

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

module.exports = router;