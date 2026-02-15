import dotenv from "dotenv/config";
import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import donationsRoutes from "./routes/donations.js"
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors({
    origin:  [process.env.USER_FRONTEND_URL],
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(port, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => console.log(err));

app.use("/donations", donationsRoutes);


