require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const sessionMiddleware = require('./config/session.js');
const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');
const listRouter = require('./routes/list.js');


const app = express();


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/list',listRouter);

app.use((req, res, next) => {
    res.status(404).send('NOT FOUND'); 
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.PORT);

module.exports = app;