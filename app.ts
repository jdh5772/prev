import express from 'express';
import path from 'path';
import {MongoClient} from 'mongodb';

const app = express();
const url = 'mongodb://moonstne:wheogus!23@localhost:27017/admin';

let db;
new MongoClient(url).connect()
.then(client=>{
    db = client.db('forum');
    console.log('db연결 성공');
})
.catch((e:Error)=>{
    console.log(e);
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    res.render('index');
})

app.listen(3000);