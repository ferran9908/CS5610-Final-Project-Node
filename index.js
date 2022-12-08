import express from "express";
import mongoose from 'mongoose'
import userController from './controllers/UserController.js'
import isLoggedIn from "./middlewares/isLoggedIn.js";

mongoose.connect(`mongodb://localhost:27017/realestate`)
  .then(() => console.log("Mongoose Connection Successful"))
  .catch(e => console.log("Mongoose Connection Failed", e))

const app = express();

const port = process.env.PORT || 4000;


app.use(express.json());


app.get("/", (_req, res) => {
  return res.send({
    message: "Welcome to our Real Estate App",
  });
});

app.use(userController)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
