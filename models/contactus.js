import Mongoose from "mongoose";

const ContactusSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: "Street Address is required"
    },
    contact: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        unmodifiable: true
    },
},
{
    versionKey: false
});

ContactusSchema.virtual('id', () => this._id.toHexString());

ContactusSchema.set('toJSON', { virtuals: true });

//ContactusSchema collections name, give only singular word - ContactUs
const ContactUs = Mongoose.model('contactus', ContactusSchema);

export default ContactUs;