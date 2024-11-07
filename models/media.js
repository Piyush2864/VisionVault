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

    categories: {
        type: String,
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

    hide: {
        type: Boolean,
        default: true
    },

    like: {
        type: Number,
        default: 0
    },

    view: {
        type: Number,
        default: 0
    }
},
 {timestamps: true}
);


const Media = mongoose.model('Media', mediaSchema);
export default Media;
