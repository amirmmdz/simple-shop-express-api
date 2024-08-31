const User = require("../../models/users/User");
const jwt = require('jsonwebtoken');
const BaseCrudService = require("../BaseCrudService");

class UserService extends BaseCrudService {
    constructor(){
        super(User);
    }

    async generateToken(id,payload) {
        try {
            const secretKey = process.env.API_SECRET_KEY;
            const options = {
                expiresIn: process.env.TOKEN_EXPIRE_TIME_IN_HOUR + 'h',
            };

            const token = jwt.sign(payload, secretKey, options);
            return token;
        } catch (error) {
            return false;
        }
    }
}

module.exports = UserService;