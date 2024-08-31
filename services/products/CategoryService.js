const Category = require("../../models/products/Category");
const jwt = require('jsonwebtoken');
const BaseCrudService = require("../BaseCrudService");
const { buildHierarchy, buildHierarchyForOne } = require("../../helpers/query");

class CategoryService extends BaseCrudService {
    constructor(){
        super(Category);
    }
    async allWithChildren() {
        try {
            const records = await buildHierarchy(this.model);
            return records;
        } catch (error) {
            return false;
        }
    }
    async findWithChildren(id) {
        try {
            const record = await buildHierarchyForOne(this.model,id);
            return record;
        } catch (error) {
            return false;
        }
    }
}

module.exports = CategoryService;