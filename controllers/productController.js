const productModel = require("../model/ProductModel");
const cloudinary = require('cloudinary').v2;

const addProduct = async(req , res) => {
    try{

        const { name , price , category , sizes , bestseller , description , style, colour} = req.body

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0]; 
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1 , image2 , image3 , image4].filter( (item) => item !== undefined)

        let imagesURL = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url; 
            })
        )

        const productData ={
            name,
            description,
            price : Number(price),
            category,
            style,
            colour,
            bestseller: bestseller === "true"? true:false,
            sizes: JSON.parse(sizes),
            image: imagesURL,
            date: Date.now()
        }

        const product = await productModel.create(productData);

        console.log(name , category, price , category , sizes , bestseller)
        console.log(imagesURL)

        res.status(201).json("Product Added");
    }
    catch(error) {
        console.log(error);
        res.status(400).json(error)
    }
}

const listProduct = async(req , res) => {
    try{
        const products = await productModel.find({});
        res.status(200).json(products);
    }
    catch(error) {
        console.log(error.message)
        res.status(400).json(error)
    }
}

const removeProduct = async(req , res) => {
    try{
        const productID = req.body.id
        await productModel.findByIdAndDelete(productID);
        res.status(201).json('Product Removed');
    }
    catch(error){
        res.status(400).json(error.message)
    }
    
}

const singleProduct = async( req , res) => {
    try{
        const product = await productModel.findById(req.body.id)
        res.status(200).status(product);
    }
    catch(error){
        res.status(400).status(error.message)
    }
}

module.exports = { listProduct, addProduct, removeProduct, singleProduct };