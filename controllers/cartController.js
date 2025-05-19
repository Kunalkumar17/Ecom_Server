const User = require('../model/User');
const jwt = require('jsonwebtoken');

module.exports.addToCart = async (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(200);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.LOGIN_TOKEN);
        const { itemID, size } = req.body;
        const userId = decodedToken.id;

        const userData = await User.findById(userId);
        const cartData = userData.cartData || {};

        if (cartData[itemID]) {
            cartData[itemID][size] = (cartData[itemID][size] || 0) + 1;
        } else {
            cartData[itemID] = { [size]: 1 };
        }

        await User.findByIdAndUpdate(userId, { cartData });

        return res.status(201).json("Added To Cart");
    } catch (error) {
        console.error("Add to Cart Error:", error);
        return res.status(401).json({ error: "Invalid token or server error" });
    }
};

module.exports.updateCart = async(req,res) => {

    const token  = req.cookies.jwt;
    try {
        if(token){
            jwt.verify(token , process.env.LOGIN_TOKEN , async(err , decodesToken) => {
                if(err){
                   res.status(401).json({ message: "Unauthorized" });
                }
                else{
                    const { itemID, size, quantity } = req.body;
                    const userId = decodesToken.id;

                    const userData = await User.findById(userId);
                    let cartData = await userData.cartData;

                    // Ensure the item exists in the cart
                    if (!cartData[itemID]) {
                        cartData[itemID] = {};
                    }

                    if (quantity === 0) {
                        // Remove the size from the item
                        delete cartData[itemID][size];

                        // If no sizes left for the item, remove the item
                        if (Object.keys(cartData[itemID]).length === 0) {
                            delete cartData[itemID];
                        }
                    } else {
                        cartData[itemID][size] = quantity;
                    }

                    // Save updated cartData
                    await User.findByIdAndUpdate(userId, { cartData });

                    res.status(201).json('Cart updated');
                        }
                    }
                )
            }

    } catch (error) {
        console.log(error)
        res.status(401).json({error})
    }
}

module.exports.getUserCart = async(req,res) => {

    const token  = req.cookies.jwt;
    try {
        if(token){
            jwt.verify(token , process.env.LOGIN_TOKEN , async(err , decodesToken) => {
                if(err){
                    //
                }
                else{
                        const userId = decodesToken.id;

                        const userData = await User.findById(userId)
                        let cartData = await userData.cartData;
                        res.status(200).json({cartData})
                        }
                    }
                )
            }

    } catch (error) {
        console.log(error)
        res.status(401).json({error})
    }
}
