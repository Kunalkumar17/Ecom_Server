const  express = require("express")
const cartController = require('../controllers/cartController')

const cartRoutes = express.Router();

cartRoutes.post('/cart/add',cartController.addToCart)
cartRoutes.post('/cart/update',cartController.updateCart)
cartRoutes.post('/cart/get',cartController.getUserCart)

module.exports = cartRoutes;