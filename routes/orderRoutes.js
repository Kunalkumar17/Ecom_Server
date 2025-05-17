const express = require('express')
const orderController = require('../controllers/orderController')

const orderRoutes = express.Router()

orderRoutes.post('/order/list',orderController.allOrders)
orderRoutes.post('/order/status',orderController.updateStatus)

orderRoutes.post('/order/place',orderController.placeOrder)
orderRoutes.post('/order/stripe',orderController.placeOrderStripe)
orderRoutes.post('/order/razorpay',orderController.placeOrderRazorpay)

orderRoutes.post('/order/user',orderController.userOrders)

orderRoutes.post('/order/verifyStripe',orderController.verifyStripe)
orderRoutes.post('/order/verifyRazorpay', orderController.verifyRazorpay)

module.exports = orderRoutes

