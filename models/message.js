import Mongoose from "mongoose";

/**
 * Schema for Message collection in mongo db
 */
const MessageSchema = new Mongoose.Schema({
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    description: {
        type: String,
        required: "Message is required"
    },
    createdDate: {
        type: Date,
        // date is today's date
        default: Date.now,
        // users cannot change
        unmodifiable: true
    },
    lastModifiedDate: {
        type: Date,
        // date is todays date
        default: Date.now,
        // users cannot change
        unmodifiable: true
    },
    house: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'House',
        // required: true
    },
    sellerEmailId: {
        type: String,
        required: true
    }
},
    {
        versionKey: false
    });

MessageSchema.virtual('id', () => this._id.toHexString());

MessageSchema.set('toJSON', { virtuals: true });

//Messages collections name, give only singular word - Message
const Message = Mongoose.model('Message', MessageSchema);

export default Message;