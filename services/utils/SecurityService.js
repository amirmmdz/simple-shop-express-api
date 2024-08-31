const bcrypt = require('bcrypt');


class SecurityService {
    async hashPassword(plain_text) {
        const hashedPassword = bcrypt.hashSync(plain_text, process.env.PASSWORD_SALT);
        if (hashedPassword)
            return hashedPassword
        return false;
    }
    async comparePassword(password,hashedPassword) {
        const isMatch = bcrypt.compareSync(password, hashedPassword);
        return isMatch;
    }
}




module.exports = SecurityService;