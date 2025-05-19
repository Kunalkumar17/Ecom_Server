require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { checkUser } = require('./middleware/authMiddleware');
const  connectCloudinary  = require('./config/cloudinary');
const productRoutes = require('./routes/productRoutes');
const { adminAuth } = require('./middleware/adminAuth');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin:  [process.env.USER_FRONTEND_URL, process.env.ADMIN_FRONTEND_URL],
    credentials: true
}));
app.use(cookieParser());
module.exports.currency = "$";

mongoose.connect(`${process.env.MongoDB_URL}/nike_auth`)
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => console.log(err));
connectCloudinary();

app.get('/admin', adminAuth);
app.post('/check' , checkUser);
app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(orderRoutes)


