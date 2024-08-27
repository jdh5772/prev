const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index',{verified:req.session.verified,username:req.session.username});
})

module.exports = router;