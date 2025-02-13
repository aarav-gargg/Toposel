import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoutes from './routes/user.route.js'

const app =express();

dotenv.config();

app.use(cors());
app.use(express.json())


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to database");

}).catch((err) => {
    console.log(err);
});

app.use('/user',userRoutes);


app.listen(3000, () => {
    console.log("server is running on port 3000");
});