const verifyCsrfToken = (req,res,next)=>{
    if(req.method === 'GET'){
        return next();
    }
    
    const csrfToken = req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];

    if (csrfToken && csrfToken === req.session.csrfToken) {
        return next();
    }

    return res.status(403).send('Invalid CSRF token');
}

module.exports = verifyCsrfToken;