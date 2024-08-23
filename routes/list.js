const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();


let db;
connectDB
.then(client=>{
    db = client.db('posts');
})


router.get('/',(req,res)=>{
    res.render('list',{username:req.session.username});
})

router.get('/write',(req,res)=>{
    if(req.session.username){
        res.render('write',{username:req.session.username});
    } else{
        res.render('login',{username:''});
    }
})

router.post('/write',(req,res)=>{
    const {title,content} = req.body;
    
})

module.exports = router;