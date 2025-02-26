const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    pool:true,
    maxConnections:1,
    service:'naver',
    host:'smtp.naver.com',
    port: 587,
    // 포트 변경해봄
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports = smtpTransport;