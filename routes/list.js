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
    res.render('list',{posts:posts});
})

router.get('/write',(req,res)=>{
    if(req.session.verified){
        res.render('write');
    } else{
        res.render('login');
    }
})

router.post('/write',async (req,res)=>{
    const {title,content} = req.body;
    await db.collection('posts').insertOne({title:title,content:content,username:req.session.username,userUUID:req.session.uuid});
    res.redirect('/list');
})

router.get('/detail/:id',async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    res.render('detail',{post});
})

router.get('/edit/:id',async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    if(post.userUUID === req.session.uuid){
        res.render('edit',{post});
    } else{
        res.redirect('/list');
    }
})

router.post('/edit/:id',async (req,res)=>{
    const {title,content} = req.body;
    await db.collection('posts').updateOne({_id:new ObjectId(req.params.id)},{$set:{title,content}});
    res.redirect('/list');
})

router.delete('/delete/:id',async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    if(post.userUUID === req.session.uuid){
        await db.collection('posts').deleteOne({_id:new ObjectId(req.params.id)});
        res.json({ok:true});
    } else{
        res.status(404).json({ok:false});
    }
})

module.exports = router;