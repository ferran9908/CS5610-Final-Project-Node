import Mongoose from "mongoose";

/**
 * Schema for House Images collection in mongo db
 */
const houseImagesSchema = new Mongoose.Schema({
    pics: {
        type: Array,
        required: false
    },
    houseId: {
        type: String,
        required: true
    }
});

houseImagesSchema.virtual('id', () => this._id.toHexString());

houseImagesSchema.set('toJSON', { virtuals: true });

//Images collection
const Images = Mongoose.model('Images', houseImagesSchema);

export default Images;