const  express = require("express")
const productController = require( "../controllers/productController"); 
const upload  = require("../middleware/multer");

const productRoutes = express.Router();

productRoutes.post('/product/add' ,upload.fields([{name:'image1' , maxCount: 1},{name:'image2' , maxCount: 1},{name:'image3' , maxCount: 1},{name:'image4' , maxCount: 1}]) ,productController.addProduct);
productRoutes.post('/product/remove', productController.removeProduct);
productRoutes.post('/product/single' , productController.singleProduct);
productRoutes.post('/product/list', productController.listProduct);

module.exports =  productRoutes;
