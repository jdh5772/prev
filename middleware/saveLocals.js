const saveLocals = (req,res,next)=>{
    res.locals.username = req.session.username || null;
    res.locals.verified = req.session.verified || false;
    res.locals.csrfToken = res.locals.csrfToken || null;
    next();
}

module.exports = saveLocals;