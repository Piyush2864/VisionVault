import Media from '../models/media.js';
import uploaddOnCloudinary from '../cloudinary.js';
import cloudinary from 'cloudinary';

// Create Media
export const createMedia = async (req, res) => {

  const userId = req.user.id;
  console.log(userId, "userId")
  const {title, description, mediaType, tags, categories } = req.body

  try {

    if (!title || !mediaType) {
      return res.status(400).json({
        success: false,
        message: "title and media are required"
      });
    }
    //imahe upload
    const imagePath = req.files?.image[0].path;
    console.log(imagePath, " image path")
    //video upload
    // const videoPath = req.files?.video[0].path;
    // console.log(videoPath, 'videoPath')

    // const videoResponse = await uploaddOnCloudinary(videoPath)
    // console.log(videoResponse, 'videoPath')

    const imageResponse = await uploaddOnCloudinary(imagePath)
    console.log(imageResponse, 'imageresponse')

    // if (!req.files?.image || !req.files?.image[0].path) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'image file is required'
    //   });
    // }

    if (!imageResponse) {
      return res.status(500).json({
        success: false,
        message: 'failed to upload file to cloudinary'
      });
    }
    const media = new Media({
      userId,
      title,
      description,
      mediaType,
      categories,
      url: imageResponse.secure_url,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      // thumbnailUrl: thumbnail.url
    });

    await media.save();

    return res.status(201).json({
      success: true,
      message: 'Media created successfully',
      imageResponse,
      media
    });

  } catch (error) {
    console.error('Error creating media:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// // Update Media
// export const updateMedia = async(req, res) => {
//   const userId = req.user.id;
//   const {mediaId} = req.params;
//   const { title, description, mediaType, tags, url, hide} = req.body;

//   try {
//     const media = await Media.findOne({_id: mediaId, userId});
//     if(!media) {
//       return res.status(404).json({
//         success: false,
//         message: 'Media not found'
//       });
//     }

//     if(title) media.title = title;
//     if(description) media.description = description;
//     if(mediaType) media.mediaType = mediaType;
//     if(tags) media.tags = tags;
//     if(url) media.url = cloudinaryResult.secure_url;


//     if(req.file) {
//       const newImagePath = req.file.path;

//       const cloudinaryResult = await uploaddOnCloudinary(newImagePath);
//       if(!cloudinaryResult) {
//         return res.status(500).json({
//           success: true,
//           message: 'failed to upload cloudinary'
//         });
//       }
//     }
    
//     if(hide !==undefined) media.hide = hide;

//     // fs.unlinkSync(newImagePath);

//     await media.updateOne();

//     return res.status(200).json({
//       success: true,
//       message: 'Media updated successfully',
//       media
//     });

//   } catch (error) {
//     console.error("Error updating media:", error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server erro'
//     });
//   }
// };


// // Delete Media
export const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const userId = req.user.id;
    const deletedMedia = await Media.findById(mediaId);
    if (!deletedMedia) {
      return res.status(404).json({ message: 'Media not found' });
    }

    if (mediaId.userId && mediaId.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this media'
      });
    }

    const publicId = deletedMedia.url.split('/').pop().split('.')[0]; // Extract public ID from URL
      const result = await cloudinary.v2.uploader.destroy(publicId, { resource_type: mediaId.mediaType });
      console.log(result.result,"result");
    
    await Media.findByIdAndDelete(mediaId);

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

