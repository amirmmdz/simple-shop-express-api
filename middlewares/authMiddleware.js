const jwt = require('jsonwebtoken');
const UserService = require('../services/users/UserService');
const AccessTokenService = require('../services/authentication/AccessTokenService');
const { verifyJWT } = require('../helpers/auth.js');

async function authMiddleware(req, res, next) {
    try {
        const userService = new UserService();
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        token = token.includes('Bearer ') ? token.replace('Bearer ', '') : token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const jwtVerify = await verifyJWT(token);
        if(jwtVerify){
            next();
        }
        else{
            return res.status(401).json({ message: 'Unauthorized' });            
        }

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


module.exports = {
    authMiddleware
};