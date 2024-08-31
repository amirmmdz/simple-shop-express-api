const Order = require("../../models/orders/Order");
const jwt = require('jsonwebtoken');
const BaseCrudService = require("../BaseCrudService");
const { buildHierarchy, buildHierarchyForOne } = require("../../helpers/query");

class OrderService extends BaseCrudService {
    constructor(){
        super(Order);
    }
}

module.exports = OrderService;