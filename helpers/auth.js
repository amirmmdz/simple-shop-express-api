const jwt = require('jsonwebtoken');
const AccessTokenService = require('../services/authentication/AccessTokenService');
const UserService = require('../services/users/UserService');
const sha256 = require('crypto-js/sha256');


async function verifyJWT(token) {
    try {
        let data = null;
        const userService = new UserService();

        const token_data = await jwt.verify(token, process.env.API_SECRET_KEY);
        const auth = token_data?.auth;
        if (!auth) {
            return false;
        }

        let user = await userService.find(auth);
        if (user) {
            const accessToken = await new AccessTokenService().where({ userId: user._id, token: sha256(token).toString(), expiresAt: { $gt: new Date() } });
            if (!accessToken) {
                return false;
            }
        }
        else {
            return false;
        }
        return {
            'user': user,
            'token_data': token_data
        };
    } catch (error) {
        return false;
    }
}

module.exports = {
    verifyJWT
};