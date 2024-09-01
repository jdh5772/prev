const connectDB = require("../config/db");
const { ObjectId } = require('mongodb');

let db;
connectDB.then((client) => {
    db = client.db("forum");
})
.catch(e=>{
    console.log(e);
});

class Post {
    static async getAllPosts() {
        try {
            const posts = await db.collection("posts").find().toArray();
            return posts;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    static async addPost(title,content,username,userUUID){
        try{
            await db.collection('posts').insertOne({title,content,username,userUUID});
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    static async getPost(id){
        try{
            const post = await db.collection('posts').findOne({_id:new ObjectId(id)});
            return post;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    static async updatePost(id,title,content){
        try{
            await db.collection('posts').updateOne({_id:new ObjectId(id)},{$set:{title,content}});
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    static async deletePost(id){
        try{
            await db.collection('posts').deleteOne({_id:new ObjectId(id)});
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
}

module.exports = Post;