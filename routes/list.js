const express = require('express');
const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');
const router = express.Router();


let db;
connectDB
.then(client=>{
    db = client.db('forum');
})


router.get('/',async (req,res)=>{
    const posts = await db.collection('posts').find().toArray();
    res.render('list',{username:req.session.username,posts:posts});
})

router.get('/write',(req,res)=>{
    if(req.session.username){
        res.render('write',{username:req.session.username});
    } else{
        res.render('login',{username:''});
    }
})

router.post('/write',async (req,res)=>{
    const {title,content} = req.body;
    await db.collection('posts').insertOne({title:title,content:content,username:req.session.username});
    res.redirect('/list');
})

router.get('/detail/:id',async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    res.render('detail',{username:req.session.username,post:post});
})

module.exports = router;