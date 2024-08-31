const yup = require("yup");
var express = require('express');
var router = express.Router();
const ProductService = require('../../services/products/ProductService');

router.get('/', async function (req, res, next) {
    try {
        return res.json({
            'data': await new ProductService().all()
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Server error",
        });
    }
});


router.get('/:id', async function (req, res, next) {
    try {
        const productId = req.params.id;
        return res.json({
            'data': await new ProductService().find(productId)
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Server error",
        });
    }
});

module.exports = router;