import mongoose, { Schema } from 'mongoose';


const mediaSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    mediaType: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },

    url: {
        type: String,
        required: true
    },

    thumbnailUrl: {
        type: String,
        default: null
    },

    tags: {
        type: [String],
        default: []
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    },

    hide: {
        type: Boolean,
        default: true
    }
});


const Media = mongoose.model('Media', mediaSchema);
export default Media;
