import Mongoose from "mongoose";
// import uniqueValidator from 'mongoose-unique-validator';
/**
 * Schema for User collection in mongo db
 */
const UserSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
}
);

const User = Mongoose.model('User', UserSchema);

export default User;