const Order = require("../../models/orders/Order");
const jwt = require('jsonwebtoken');
const BaseCrudService = require("../BaseCrudService");
const { buildHierarchy, buildHierarchyForOne } = require("../../helpers/query");

class OrderService extends BaseCrudService {
    constructor(){
        super(Order);
    }
    async userOrders(userId) {
        try {
            const record = await this.model.where({ userId: userId });
            if (!record) {
                return null;
            }
            return record;
        } catch (error) {
            return false;
        }
    }
}

module.exports = OrderService;