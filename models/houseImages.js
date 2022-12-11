import Mongoose from "mongoose";

/**
 * Schema for House Images collection in mongo db
 */
const houseImagesSchema = new Mongoose.Schema({
  pic: {
    type: String,
    required: false,
  },
  houseId: {
    type: String,
  },
});

houseImagesSchema.virtual("id", () => this._id.toHexString());

houseImagesSchema.set("toJSON", { virtuals: true });

//Images collection
const Images = Mongoose.model("Image", houseImagesSchema);

export default Images;

