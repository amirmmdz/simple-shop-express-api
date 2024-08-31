const Product = require("../../models/products/Product");
const jwt = require('jsonwebtoken');
const BaseCrudService = require("../BaseCrudService");
const { buildHierarchy, buildHierarchyForOne } = require("../../helpers/query");

class ProductService extends BaseCrudService {
    constructor(){
        super(Product);
    }
    async all() {
        try {
            const records = await this.model.find({}).populate('categories').exec();
            return records;
        } catch (error) {
            return false;
        }
    }
    async find(id) {
        try {
            const record = await this.model.findById(id).populate('categories');
            return record;
        } catch (error) {
            return false;
        }
    }
}

module.exports = ProductService;