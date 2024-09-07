const smtpTransport = require('../config/email.js');
const crypto = require('crypto');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const connectDB = require('../config/db.js');

let db;
connectDB
.then(client=>{
    db = client.db('forum');
})

const generateEmailVerificationToken = ()=>{
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours()+24);
    return {token,expires};
}

const sendVerifyMail = async (mail,username)=>{
    const { token, expires } = generateEmailVerificationToken();
    const email = mail;
    const mailOptions = {
        from: 'moonstne@naver.com',
        to: email,
        subject: '회원가입 인증',
        html: `
        <p> <a href="${BASE_URL}/auth/verify/?username=${username}&token=${token}">이거 누르면 인증됨요</a></p>
        <p>만료일: ${expires}.</p>`
    };

    try{
        await smtpTransport.sendMail(mailOptions);
        await db.collection('user').updateOne({ email: email }, { $set: { token: token, expires: expires } });
    }
    catch(e){
        console.error('이메일 전송 실패:', err);
    }
}

module.exports = sendVerifyMail;