import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userController from "./controllers/UserController.js";
import bookingController from "./controllers/BookingController.js";
import isLoggedIn from "./middlewares/isLoggedIn.js";
import path from 'path'
import houseController from "./controllers/HouseController.js";
import messageController from "./controllers/MessageController.js";
import multer from "multer";
import Images from "./models/houseImages.js";

const __dirname = path.resolve();

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || `mongodb://localhost:27017/realestate`)
  .then(() => console.log("Mongoose Connection Successful"))
  .catch((e) => console.log("Mongoose Connection Failed", e));

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public/images')));

app.get("/", (_req, res) => {
  return res.send({
    message: "Welcome to our Real Estate App",
  });
});





// The code below uses /public/images folder
var storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' +file.originalname )
    cb(null, file.originalname)

  }
})

//uploading images
const upload = multer({ storage: storage }).array('file')
app.post('/upload-images', async function (req, res) {
  const { id } = req.query

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    const dataToInsert = req.files.map(file => ({ pic: file.originalname, houseId: id }))

    const images = await Images.insertMany(dataToInsert)

    return res.status(200).send(images)
  })

});


app.use("/user", userController);
app.use("/booking", bookingController);
app.use("/house", houseController);
app.use("/message", messageController);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
