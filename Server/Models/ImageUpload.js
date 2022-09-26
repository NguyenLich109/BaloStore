// const mongoose = require("mongoose")
import mongoose from "mongoose";
const Schema = mongoose.Schema;
// const ImageUpload = new Schema (
const ImageSchema = new Schema (
    {
        image: { type: String, require: true },
        title: {type: String},
        imageId: {type: String}
    },
    // { timestamps: true }
);
const ImageUpload = new mongoose.model("ImageUpload", ImageSchema)
// module.export = imageUpload;
export default ImageUpload;