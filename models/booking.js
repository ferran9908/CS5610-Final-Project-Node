import Mongoose from "mongoose";

const BookingSchema = new Mongoose.Schema({
    buyerID: {
        type: String,
        required: true
    },
    buyerEmailId: {
        type: String,
        required: true
    },
    house: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'House'
    },
    sellerID: {
        type: String,
        required: true
    },
    sellerEmailId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        unmodifiable: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    },

},
    {
        versionKey: false
    });

BookingSchema.virtual('id', () => this._id.toHexString());

BookingSchema.set('toJSON', { virtuals: true });

//bookings collections name, give only singular word - booking
const Booking = Mongoose.model('Booking', BookingSchema);

export default Booking;