const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader){
        req.isAuth = false;
        return next();
    }

    // so here we spliting the token from space like // barer 12876 // [1] means getting the token
    const token = authHeader.split(' ')[1];
    if (!token || token === ''){
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {                               // this is the secret key which we use when we generating new token
        decodedToken = jwt.verify(token, 'somesupersecretkey');   
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};