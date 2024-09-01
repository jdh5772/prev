const saveLocals = (req,res,next)=>{
    res.locals.username = req.session.username || null;
    res.locals.verified = req.session.verified || false;
    res.locals.csrfToken = res.locals.csrfToken || null;
    res.locals.uuid = req.session.uuid || null ;
    next();
}

module.exports = saveLocals;