const AccessToken = require("../../models/authentication/AccessToken");
const BaseCrudService = require("../BaseCrudService");

class AccessTokenService extends BaseCrudService {
    constructor(){
        super(AccessToken);
    }
}

module.exports = AccessTokenService;