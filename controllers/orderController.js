const orderModel = require('../model/orderModel')
const userModel = require('../model/User')
const jwt = require('jsonwebtoken')
const Stripe = require('stripe')
const Razorpay = require('razorpay')
const currency = "usd"
const deliveryCharge = 10;

console.log()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new Razorpay({
    key_id : process.env.RAZOR_KEY_ID,
    key_secret : process.env.RAZOR_SECRET_KEY
})

module.exports.placeOrder = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json("No token found. Please login.");
        }

        jwt.verify(token, process.env.LOGIN_TOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return res.status(401).json("Not Authorised! Please Login");
            }

            const { items, amount, address } = req.body;
            const userId = decodedToken.id;

            const orderData = {
                userId,
                items,
                amount,
                address,
                paymentMethod: 'COD',
                payment: false,
                date: Date.now()
            };

            const newOrder = new orderModel(orderData);
            await newOrder.save();

            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            return res.status(201).json("Order Placed");
        });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.placeOrderStripe = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "No token found. Please login." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.LOGIN_TOKEN);
        const { items, amount, address } = req.body;
        const { origin } = req.headers;
        const userId = decodedToken.id;  

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map(item => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        return res.status(201).json({ session_url: session.url });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: error.message });
    }
};


module.exports.verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.LOGIN_TOKEN);
        const userId = decoded.id;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            return res.status(201).json({ message: "Payment successful" });
        } else {
            return res.status(200).json({ message: "Payment failed or cancelled." });
        }
    } catch (error) {
        console.error("Stripe verification error:", error);
        return res.status(500).json({ message: error.message });
    }
};
 

module.exports.placeOrderRazorpay = async(req,res) =>{
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "No token found. Please login." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.LOGIN_TOKEN);
        const { items, amount, address } = req.body;
        const userId = decodedToken.id;  

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount : amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options , (error, order) => {
            if(error){
                console.log(error)
                return res.status(500).json({message:error})
            }
            res.status(201).json(order)
        })
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.verifyRazorpay = async(req , res) => {
    const { razorpay_order_id } = req.body;
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.LOGIN_TOKEN);
        const userId = decoded.id;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log(orderInfo)
        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.status(201).json("Payment Successfull")
        } else {
            res.status(200).json("Payment Failed") 
        }    
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.allOrders = async(req,res) => {
    try {
        const token = req.cookies.admin_jwt;
        if (!token) {
            return res.status(401).json("Not Authorised");
        }

        jwt.verify(token, process.env.ADMIN_LOGIN_TOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return res.status(401).json("Not Authorised!");
            }
            
            const allOrders = await orderModel.find()
            return res.status(201).json(allOrders);
        });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.userOrders = async(req,res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json("Please Login to See Your Orders");
        }

        jwt.verify(token, process.env.LOGIN_TOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return res.status(401).json("Not Authorised! Please Login");
            }

            const userId = decodedToken.id;
            const orderDetails = await orderModel.find({userId})
            return res.status(201).json(orderDetails);
        });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.updateStatus = async(req,res) => {

    const { orderId , status} = req.body
   try {
        const token = req.cookies.admin_jwt;
        if (!token) {
            return res.status(401).json("Not Authorised");
        }

        jwt.verify(token, process.env.ADMIN_LOGIN_TOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return res.status(401).json("Not Authorised! Please Login");
            }
            
            await orderModel.findByIdAndUpdate(orderId , { status })


            return res.status(201).json('Status Updated');
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: error.message });
    }
}

