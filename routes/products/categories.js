const yup = require("yup");
var express = require('express');
var router = express.Router();
const CategoryService = require('../../services/products/CategoryService');

router.get('/', async function (req, res, next) {
    try {
        return res.json({
            'data': await new CategoryService().allWithChildren()
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Server error",
        });
    }
});


router.get('/:id', async function (req, res, next) {
    try {
        const categoryId = req.params.id;
        return res.json({
            'data': await new CategoryService().findWithChildren(categoryId)
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Server error",
        });
    }
});

module.exports = router;