const Post = require('../models/postModel');

exports.getList = async (req,res)=>{
    const posts = await Post.getAllPosts();
    res.render('list',{posts});
}

exports.getWrite = (req,res)=>{
    if(req.session.verified){
        res.render('write');
    } else{
        res.render('login');
    }
}

exports.postWrite = async (req,res)=>{
    const {title,content} = req.body;
    await Post.addPost(title,content,req.session.username,req.session.uuid);
    res.redirect('/list');
}

exports.getDetail = async (req,res)=>{
    const post = await Post.getPost(req.params.id);
    res.render('detail',{post});
}

exports.getEdit = async (req,res)=>{
    const post = await Post.getPost(req.params.id);
    if(post.userUUID === req.session.uuid){
        res.render('edit',{post});
    } else{
        res.redirect('/list');
    }
}

exports.postEdit = async (req,res)=>{
    const {title,content} = req.body;
    await Post.updatePost(req.params.id,title,content);
    res.redirect('/list');
}

exports.deletePost = async (req,res)=>{
    const post = await Post.getPost(req.params.id)
    if(post.userUUID === req.session.uuid){
        await Post.deletePost(req.params.id);
        res.json({ok:true});
    } else{
        res.status(404).json({ok:false});
    }
}