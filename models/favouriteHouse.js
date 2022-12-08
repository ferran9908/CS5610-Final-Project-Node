import Mongoose from "mongoose";

/**
 * Schema for favourite-House collection in mongo db
 */
const favouriteHouseSchema = new Mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        houseId: {
            type: String,
            required: true
        }
    });

favouriteHouseSchema.virtual('id', () => this._id.toHexString());

favouriteHouseSchema.set('toJSON', { virtuals: true });

//Messages collections name, give only singular word - Message
const Favourite = Mongoose.model('Favourite', favouriteHouseSchema);

export default Favourite;