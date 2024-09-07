import express,{Request,Response,NextFunction} from 'express';
import path from 'path';
import morgan from 'morgan';
import {sequelize} from '../src/models';
import {CustomError} from './types/customError';

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../views'));
sequelize.sync({force:false})
.then(()=>{
    console.log('데이터베이스 연결 성공');
})
.catch(e=>{
    console.log(e);
})
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));


app.get('/',(req,res)=>{
    res.render('index');
})

app.use((req,res,next)=>{
    const err = new CustomError(`${req.method} ${req.url} 라우터가 없습니다.`,404);
    next(err);
})

app.use((err:CustomError,req:Request,res:Response,next:NextFunction)=>{
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message:err.message,
        error:process.env.NODE_ENV === 'development' ? err : {}
    });
})

app.listen(3000);