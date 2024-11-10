import mongoose, { Schema } from 'mongoose';



const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
        required: true
    },

},
{timestamps: true}
);

likeSchema.index({ userId: 1, mediaId: 1}, {unique: true});

const Like = mongoose.model('Like', likeSchema);
export default Like;