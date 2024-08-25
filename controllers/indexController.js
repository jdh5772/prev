const getIndex = (req,res)=>{
    res.render('index',{username:req.session.username});
}

module.exports = getIndex;