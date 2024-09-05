const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { checkUser } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

const dbURL = "mongodb+srv://Kunal:Kunal172001@cluster0.ncgvnrc.mongodb.net/nike_auth";

mongoose.connect(dbURL)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.get('*' , checkUser);
app.use(authRoutes);

