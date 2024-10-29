import mongoose, { Schema } from 'mongoose';


const locationSchema = new Schema({
    city:{
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    zipCode: {
        type: String
    }
});

const profileSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    contactDetails: {
        type: String,
        required: true,
        unique: true
    },

    location: {
        type: locationSchema,
        required: true
    },

    bio: {
        type: String,
        maxlength: 500
    },

    profilePicture: {
        type: String
    },

    socialLinks: {
        facebook: {
            type: String
        },

        twitter: {
            type: String
        },

        instagram: {
            type: String
        },

        linkedin: {
            type: String
        }
    },

    skills: {
        type: [String]
    },

    availability: {
        type: String,
        enum: ['Available', 'Busy', 'Not Availabe'],
        default: 'Available'
    }
}, {timestamps: true});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;