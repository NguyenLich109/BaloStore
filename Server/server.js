import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors'; // upload 

import connectDatabase from './config/MongoDb.js';
import ImportData from './DataImport.js';
import productRoute from './Routes/ProductRoutes.js';
import { errorHandler, notFound } from './Middleware/Errors.js';
import userRouter from './Routes/UserRoutes.js';
import orderRouter from './Routes/orderRoutes.js';
import SliderRouter from './Routes/SliderRouter.js';
import cartRoutes from './Routes/cartRoutes.js';
import categoryRoute from './Routes/categoryRouter.js';
import path from 'path';
import Upload from './Routes/Upload.js';
import avatarRouter from './Routes/avatarRouter.js';
import { isPromise } from 'util/types';
// import img
import multer from 'multer';
import cloudinary from 'cloudinary'
import bodyParser from "body-parser";
import cors from "cors";
import ImageUpload from "./Models/ImageUpload.js";
// import mongoose from 'mongoose';
const port = 5000;

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());



 //==new==========================================================================================
 //IMAGE UPLOAD CONFIGURATION
const storage = multer.diskStorage({
filename: function(req, file, callback) {
callback(null, Date.now() + file.originalname);
}
});
const imageFilter = function(req, file, cb) {
// accept image files only
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
return cb(new Error("Only image files are accepted!"), false);
}
cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });
// const cloudinary = require("cloudinary");
cloudinary.config({
cloud_name: process.env.CLOUDINARY_HOST, //ENTER YOUR CLOUDINARY NAME
api_key: process.env.CLOUDINARY_API_KEY, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
api_secret: process.env.CLOUDINARY_API_SECRET // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
});

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
// Initialize CORS middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  //=======ROUTES=======
  // tạo đường dẫn api lấy dữ liệu từ mongodb
  app.get("/api/ali", (req, res) => {
      ImageUpload.find(function(err, images) {
          if(err) {
              req.json(err.message);
          } else {
              res.json(images);
          }
      })
  })
  
    app.post("/add", upload.single("image"), (req, res) => {
        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
          if (err) {
            req.json(err.message);
          }
          req.body.image = result.secure_url;
          // add image's public_id to image object
          req.body.imageId = result.public_id;
      
          ImageUpload.create(req.body, function(err, image) {
            if (err) {
              res.json(err.message);
              return res.redirect("/ali");
            }
          });
        });
      });
 //==new===========================================================================================


// API
app.use('/api/cart', cartRoutes);
app.use('/api/slider', SliderRouter);
app.use('/api/avatar', avatarRouter);
app.use('/api/import', ImportData);
app.use('/api/products', productRoute);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/category', categoryRoute);
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});
app.use('/api/upload-profile-pic', Upload);

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
