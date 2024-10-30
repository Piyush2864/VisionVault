import Media from "../models/media";



export const createMedia = async (req,res) => {
    const { title, description, mediaType, url, thumbnailUrl, tags, hide } = req.body;

    try {
        const media = new Media({
            userId: req.user.id,
            title,
            description,
            mediaType,
            url,
            thumbnailUrl,
            tags,
            hide
        });

        await media.save();
        return res.status(201).json({
            success: true,
            message: 'Media created successfully',
            media
        });
    } catch (error) {
        console.error("Error in createmedia:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// update media
export const updateMedia = async(req, res) => {
    const { mediaId } = req.params;
    const { title, description, mediaType, url, thumbnailUrl, tags, hide } = req.body;
    try {
        const media = await Media.findById(mediaId);
        if(!mediaId) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        // Update media fields
        media.title = title || media.title;
        media.description = description || media.description;
        media.mediaType = mediaType || media.mediaType;
        media.url = url || media.url;
        media.thumbnailUrl = thumbnailUrl || media.thumbnailUrl;
        media.tags = tags || media.tags;
        media.hide = hide || media.hide;

        await media.updateOne();
        return res.status(200).json({
            success: true,
            message: 'Media updated successfully',
            media
        });
    } catch (error) {
        console.error("Error in update media:", error)
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete media
export const deleteMedia = async(req,res) => {
    const { mediaId } = req.params;
    try {
        const media = await Media.findOne(mediaId);
        if(!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        await media.remove();
        return res.status(200).json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error("Error in deleting media")
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Public media
export const getPublicMedia = async(req,res)=> {
    try {
        const media = await Media.find({ public: true}).populate('userId', 'name email');
        return res.status(200).json({
            success: true,
            media
        });
    } catch (error) {
        console.error("Error in fetching public media:", error);
        return res.status(500).json({
            success:false,
            message: 'Server error'
        });
    }
};

// Get all media from admin
export const getAllMediaForAdmin = async(req,res) => {
    try {
        const media = await Media.find().populate('userId', 'name email');
        return res.status(200).json({
            success: true,
            media
        });
    } catch (error) {
        console.error("Error fetching all media for admin:", error);
        return res.status(500).json({
            success:false,
            message: 'Server error'
        });
    }
};

// Get media by user Id (for the user to see their own media)
export const getMediaByUserId = async(req, res) => {
    const { userId } = req.params;
    try {
        const media = await Media.find({userId}).populate('userId', 'name email');
        return res.status(200).json({
            success:true,
            media
        });
    } catch (error) {
        console.error("Error fetching media by user Id:", error);
        return res.status(500).json({
            success:false,
            message: 'Server error '
        });
    }
};