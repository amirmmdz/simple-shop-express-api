const yup = require("yup");
var express = require('express');
var router = express.Router();
const { verifyJWT } = require('../../helpers/auth');
const { authMiddleware } = require("../../middlewares/authMiddleware");
const OrderService = require("../../services/orders/OrderService");
const ProductService = require("../../services/products/ProductService");

router.get('/user-oders', authMiddleware, async function (req, res, next) {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        token = token.includes('Bearer ') ? token.replace('Bearer ', '') : token;
        const jwtVerify = await verifyJWT(token);
        const user = jwtVerify?.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const orders = await new OrderService().whereWithDetails({ userId: user._id })
        return res.json({
            'data': orders
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Server error",
        });
    }
});


router.get('/user-oders/:id', authMiddleware, async function (req, res, next) {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        token = token.includes('Bearer ') ? token.replace('Bearer ', '') : token;
        const jwtVerify = await verifyJWT(token);
        const user = jwtVerify?.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const orderId = req.params.id;
        const order = await new OrderService().whereWithDetails({ userId: user._id, _id: orderId });
        return res.json({
            'data': order
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Server error",
        });
    }
});

router.post('/order', authMiddleware, async function (req, res, next) {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        token = token.includes('Bearer ') ? token.replace('Bearer ', '') : token;
        const orderService = new OrderService();
        const productService = new ProductService();
        const jwtVerify = await verifyJWT(token);
        const user = jwtVerify?.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const orderSchemaValidation = yup.object({
            productIds: yup.array().of(
                yup.object({
                    productId: yup.string().required(),
                    count: yup.number().positive().integer().required()
                }).test('productExists', 'Product ID does not exist', async (productData) => {
                    const product = await productService.find(productData.productId);
                    return product && product?.count >= productData?.count;
                })
            )
        });
        orderSchemaValidation.validate(req.body).then(async () => {
            const productIds = req.body.productIds;
            const order = await orderService.create({
                userId: user._id,
                trackingCode: Date.now(),
                totalPrice: 0,
            });
            let totalPrice = 0;
            let productsToBuy = [];
            for (let i = 0; i < productIds.length; i++) {
                const productId = productIds[i];
                const product = await productService.find(productId.productId);
                if (product) {
                    totalPrice += product.price;
                    productsToBuy.push({
                        productTitle: product.name,
                        productId: product._id,
                        price: product.price,
                        count: productId.count,
                    });
                    await productService.update(product._id,{
                        count: parseInt(product.count) - parseInt(productId.count),
                    });
                }
            }
            const finalOrder = await orderService.update(order._id,{
                totalPrice: totalPrice,
                orderDetails: productsToBuy,
            });
            return res.json({
                'order':await orderService.find(order._id),
                'totalPrice':totalPrice,
                'datetime': new Date(),
                'timestamp': Date.now(),
            });
        }).catch((err) => {
            return res.status(400).json({
                "message": "Validation error",
                "errors": err
            });
        });
    } catch (error) {
        console.log('first__', error);
        return res.status(500).json({
            "message": "Server error",
        });
    }
});

module.exports = router;