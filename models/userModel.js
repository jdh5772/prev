const connectDB = require('../config/db');
const { v4: uuidv4 } = require("uuid");

let db;
connectDB
.then(client=>{
    db = client.db('forum');
})
.catch(e=>{
    console.log(e);
})

class User{
    static async addUser(username,password,email){
        try{
            const uuid = uuidv4();
            await db.collection('user').insertOne({username,password,email,verified:false,uuid});
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    static async getUser(query){
        try{
            const user = await db.collection('user').findOne(query);
            return user;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    static async updateUser(username){
        try{
            await db.collection('user').updateOne({username},{$set:{verified:true}});
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
}

module.exports = User;