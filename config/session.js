const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.URL,
        dbName:'user'
    })
});

module.exports = sessionMiddleware;