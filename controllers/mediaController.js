import mongoose from "mongoose";
import Media from "../models/media.js";
import cloudinary from 'cloudinary';



// export const createMedia = async (req,res) => {

//     const { title, description, mediaType, url, thumbnailUrl, tags, hide } = req.body;

//     try {
//         const media = new Media({
//             userId: req.user.id,
//             title,
//             description,
//             mediaType,
//             url,
//             thumbnailUrl,
//             tags,
//             hide
//         });

//         await media.save();
//         return res.status(201).json({
//             success: true,
//             message: 'Media created successfully',
//             media
//         });
//     } catch (error) {
//         console.error("Error in createmedia:", error);
//         return res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

// // update media
// export const updateMedia = async(req, res) => {
//     const { mediaId } = req.params;
//     const { title, description, mediaType, url, thumbnailUrl, tags, hide } = req.body;
//     try {
//         const media = await Media.findById(mediaId);
//         if(!mediaId) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Media not found'
//             });
//         }

//         // Update media fields
//         media.title = title || media.title;
//         media.description = description || media.description;
//         media.mediaType = mediaType || media.mediaType;
//         media.url = url || media.url;
//         media.thumbnailUrl = thumbnailUrl || media.thumbnailUrl;
//         media.tags = tags || media.tags;
//         media.hide = hide || media.hide;

//         await media.updateOne();
//         return res.status(200).json({
//             success: true,
//             message: 'Media updated successfully',
//             media
//         });
//     } catch (error) {
//         console.error("Error in update media:", error)
//         return res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

// // Delete media
// export const deleteMedia = async(req,res) => {
//     const { mediaId } = req.params;
//     try {
//         const media = await Media.findOne(mediaId);
//         if(!media) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Media not found'
//             });
//         }

//         await media.remove();
//         return res.status(200).json({
//             success: true,
//             message: 'Media deleted successfully'
//         });
//     } catch (error) {
//         console.error("Error in deleting media")
//         return res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

// // Public media
// export const getPublicMedia = async(req,res)=> {
//     try {
//         const media = await Media.find({ public: true}).populate('userId', 'name email');
//         return res.status(200).json({
//             success: true,
//             media
//         });
//     } catch (error) {
//         console.error("Error in fetching public media:", error);
//         return res.status(500).json({
//             success:false,
//             message: 'Server error'
//         });
//     }
// };

// // Get all media from admin
// export const getAllMediaForAdmin = async(req,res) => {
//     try {
//         const media = await Media.find().populate('userId', 'name email');
//         return res.status(200).json({
//             success: true,
//             media
//         });
//     } catch (error) {
//         console.error("Error fetching all media for admin:", error);
//         return res.status(500).json({
//             success:false,
//             message: 'Server error'
//         });
//     }
// };

// // Get media by user Id (for the user to see their own media)
// export const getMediaByUserId = async(req, res) => {
//     const { userId } = req.params;
//     try {
//         const media = await Media.find({userId}).populate('userId', 'name email');
//         return res.status(200).json({
//             success:true,
//             media
//         });
//     } catch (error) {
//         console.error("Error fetching media by user Id:", error);
//         return res.status(500).json({
//             success:false,
//             message: 'Server error '
//         });
//     }
// };


//Configure cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwc1kyrwy',
    api_key: process.env.CLOUDINARY_API_KEY || '587661277666165',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'mQHa2_jisA1e_xXhqVtCbWsEYj0'
  });
  

//Helper function for uploading files to cloudinary 
const uploadToCloudinary = async (file, folder) => {
    return await cloudinary.v2.uploader.upload(file, {
      folder,
      resource_type: 'auto', // auto-detects the file type (image or video)
    });
  };
  
//create Media
export const createMedia = async(req, res) => {
    const { title, description, hide } = req.body;
    const userId = req.user.id;

    try {
        const mediaArray = [];

        //Process images 
        if(req.files['images']) {
            for(const file of req.files['images']) {
                const result = await uploadToCloudinary(file.buffer, 'images');
                mediaArray.push({
                    userId,
                    title: title  || 'untitled image',
                    description, 
                    mediaType: 'image',
                    url: result.secure_url,
                    thumbnailUrl: result.eager && result.eager.length > 0 ? result.eager[0].secure_url: null,
                    hide
                });
            }
        }
        //Process video
        if(req.files['video'] && req.files['video'].length > 0){
            const result = await uploadToCloudinary(req.files['video'][0].buffer, 'videos');
            mediaArray.push({
                userId,
                title: title  || 'Untitled video',
                description,
                mediaType: 'video',
                url: result.secure_url,
                thumbnailUrl: result.eager &&result.eager.length > 0 ? result.eager[0].secure_url: null,
                hide
            });
        }

        //save all media items to  the database
        const createMediaEntries= await Media.insertMany(mediaArray);
        console.log('media information:', createMediaEntries )
        return res.status(201).json({
            success: true,
            message: 'media uploaded successfully',
            data: createMediaEntries
        })
    } catch (error) {
        console.error('Error creating media:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error '
        });
    }
};

// Update media
export const updateMedia = async(req, res) => {
    const { mediaId } = req.params;
    const { title, description, hide } = req.body;

    if(!mongoose.Types.ObjectId.isValid(mediaId)){
        return res.status(400).json({
            success: false,
            message: 'Invalid mesia id'
        })
    };

    try {
        const updateMedia = await Media.findByIdAndUpdate(
            mediaId,
            {title, description, hide},
            {new: true}
        );

        if(!updateMedia) {
            return res.status(404).json({
                success: false,
                message: 'media not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'media updated successfully',
            data: updateMedia
        });
    } catch (error) {
        console.error('Error updating media:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete media
export const deleteMedia = async(req, res) => {
    const {mediaId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(mediaId)){
        return res.status(400).json({
            success: false,
            message: 'Invalid mediaId'
        });
    }

    try {
        const media = await Media.findById(mediaId);
        if(!media){
            return res.status(404).json({
                success: false,
                message: 'media not found'
            });
        }

        //Delete from cloudinary
        const publicId = media.url.split('/').pop().split('.')[0];
        await uploadToCloudinary.v2.uploader.destroy(publicId, { resource_type: media.mediaType});

        // Delete from the database
        await Media.findByIdAndDelete(mediaId);

        return res.status(200).json({
            success: false,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting media:', error);
        return res.status(500).json({
            success:false,
            message:'Server error'
        });
    }
};

// Get publis media
export const getPublicMedia = async(req, res) => {
    try {
        const media = await Media.find({ hide: false});
        return res.status(200).json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error('Error fetching public media:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

//Get all media for admin
export const getAllMediaForAdmin = async(req, res) => {
    try {
        const media = await Media.find();
        return res.status(200).json({
            success:true,
            data: media
        });
    } catch (error) {
        console.error('Error fetching media for admin:', error);
        return res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
};

//Get media by user id
export const getMediaByUserId = async(req, res) => {
    const { userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({
            success: false,
            message: "Invalid user id"
        });
    }

    try {
        const media = await Media.find({ userId });
        return res.status(200).json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error('Error fetching media id by user id:', error);
        return res.status(500).json({
            success: true,
            message: 'server error'
        });
    }
};