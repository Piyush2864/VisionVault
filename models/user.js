import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
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

    profilePicture: {
        type: String,
        default: null
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],
        default: "user"
    },

    isArtist: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const User = mongoose.model('User', userSchema);


export default User