import Like from "../models/like.js";


export const likeMedia = async(req, res) => {
    const userId = req.user.id;
    const {mediaId} = req.body;

    try {
        const existingLike = await Like.findOne({ userId, mediaId});
        console.log('existing like ',existingLike)
        if(existingLike) {
            await Like.deleteOne({_id: existingLike._id});
            return res.status(200).json({
                success: true,
                message: 'Media unliked successfully'
            });
        }
        else{
            const like = await Like.create({ userId, mediaId});
            console.log("like id", like)
            return res.status(201).json({
                success: true,
                message: 'Media liked successfully',
                data: like
            });
        }
    } catch (error) {
        console.error("Error in like", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};