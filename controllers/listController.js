const connectDB = require('../config/db.js');
const {ObjectId} = require('mongodb');

let db;
connectDB
.then(client=>{
    db = client.db('forum');
})

const getAllPosts = async (req,res)=>{
    const posts = await db.collection('posts').find().toArray();
    res.render('list',{username:req.session.username,posts:posts});
}

const getWrite = (req,res)=>{
    if(req.session.username){
        res.render('write',{username:req.session.username});
    } else{
        res.render('login',{username:''});
    }
}

const postWrite = async (req,res)=>{
    const {title,content} = req.body;
    await db.collection('posts').insertOne({title:title,content:content,username:req.session.username});
    res.redirect('/list');
}

const getDetail = async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    res.render('detail',{username:req.session.username,post:post});
}

const getEdit = async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    if(post.username === req.session.username){
        res.render('edit',{username:req.session.username,post:post});
    } else{
        res.redirect('/list');
    }
}

const postEdit = async (req,res)=>{
    const {title,content} = req.body;
    await db.collection('posts').updateOne({_id:new ObjectId(req.params.id)},{$set:{title:title,content:content,username:req.session.username}});
    res.redirect('/list');
}

const deletePost = async (req,res)=>{
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    if(post.username === req.session.username){
        await db.collection('posts').deleteOne({_id:new ObjectId(req.params.id)});
        res.redirect('/list');
    } else{
        res.redirect('/list');
    }
}

module.exports = {
    getAllPosts,
    getWrite,
    postWrite,
    getDetail,
    getEdit,
    postEdit,
    deletePost
}