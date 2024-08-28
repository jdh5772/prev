"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
const url = 'mongodb://moonstne:wheogus!23@localhost:27017/admin';
let db;
new mongodb_1.MongoClient(url).connect()
    .then(client => {
    db = client.db('forum');
    console.log('db연결 성공');
})
    .catch((e) => {
    console.log(e);
});
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.get('/', (req, res) => {
    res.render('index');
});
app.listen(3000);
