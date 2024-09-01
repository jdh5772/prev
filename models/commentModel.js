const connectDB = require('../config/db');

let db;
connectDB
.then(client=>{
    db = client.db('forum');
})
.catch(e=>{
    console.log(e);
})

class Comment {
    static async addComment(postId,username,comment){
        try{
            await db.collection('comment').insertOne({postId,username,comment});
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
}

module.exports = Comment;