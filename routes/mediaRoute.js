// import express from 'express';
// import { createMedia, deleteMedia,  getAllMediaForAdmin,  getMediaByUserId, getPublicMedia, updateMedia } from '../controllers/mediaController.js';
// import {authMiddlewares} from '../middlewares/authMiddleware.js'
// import { profilePicture, uploadMedia, uploadProfilePhoto } from '../middlewares/mediaMiddleware.js';


// const router = express.Router();


// // Route for uploading a profile photo (Admin-only) 
// router.route('/upload/profile-photo').post(authMiddlewares('admin'), profilePicture, uploadProfilePhoto )
// router.route('/upload/media').post(authMiddlewares('admin'), uploadMedia, createMedia)
// // Public routes
// router.route('/media/public').get(getPublicMedia);
// router.route('/media/user/:userId').post(getMediaByUserId);

// // Admin routes
// router.use(authMiddlewares('admin'));
// router.route('/createmedia').post(createMedia);
// router.route('/update/:mediaId').put(updateMedia);
// router.route('/delete/:mediaId').delete(deleteMedia);
// router.route('/media/all').get(getAllMediaForAdmin);

// export default router;





import express from 'express';
import {
    createMedia,
    updateMedia,
    deleteMedia,
    getPublicMedia,
    getAllMediaForAdmin,
    getMediaByUserId,
} from '../controllers/mediaController.js';

import { authMiddlewares } from '../middlewares/authMiddleware.js';
import {
    profilePicture,
    uploadMedia
} from '../middlewares/mediaMiddleware.js';
import cloudinary from 'cloudinary';
import User from '../models/user.js';


const router = express.Router();

// Route to upload a profile picture (Admin-only)
router.post('/upload/profile-photo', authMiddlewares('admin'), profilePicture, async (req, res) => {
    try {
        // Assuming you have a separate controller method or logic here to handle profile picture upload
        const profilePictureUrl = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pictures'
        });

        // Update user's profile picture URL in the database
        // (Assuming `req.user._id` is available after authentication middleware)
        await User.findByIdAndUpdate(req.user._id, { profilePicture: profilePictureUrl.secure_url });

        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePictureUrl: profilePictureUrl.secure_url
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to upload media files (Admin-only)
router.post('/upload/media', authMiddlewares('admin'), uploadMedia, async (req, res) => {
    try {
        // Logic to handle media upload
        const imageUrls = [];
        const videoUrl = null;

        if (req.files['images']) {
            for (const image of req.files['images']) {
                // const uploadedImage = await cloudinary.uploader.upload(image.path, { folder: 'media/images' });
                const uploadedImage = await cloudinary.uploader.upload(image.path, { folder: './public/temp' });
                imageUrls.push(uploadedImage.secure_url);
            }
        }

        if (req.files['video']) {
            const uploadedVideo = await cloudinary.uploader.upload(req.files['video'][0].path, {
                resource_type: 'video',
                // folder: 'media/videos',
                folder: './public/temp'
            });
            videoUrl = uploadedVideo.secure_url;
        }

        // Save the media URLs to the database by calling the createMedia controller function
        req.body.imageUrls = imageUrls;
        req.body.videoUrl = videoUrl;
        createMedia(req, res);
    } catch (error) {
        console.error("Error uploading media:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Public route to get all public media
router.get('/media/public', getPublicMedia);

// Public route to get media by specific user ID
router.get('/media/user/:userId', authMiddlewares('user'), getMediaByUserId);

// Admin-only route to get all media
router.get('/media/all', authMiddlewares('admin'), getAllMediaForAdmin);

// Admin-only route to update specific media by media ID
router.put('/update/:mediaId', authMiddlewares('admin'), uploadMedia, async (req, res) => {
    try {
        // Similar logic as createMedia for handling file upload for update
        const imageUrls = [];
        const videoUrl = null;

        if (req.files['images']) {
            for (const image of req.files['images']) {
                const uploadedImage = await cloudinary.uploader.upload(image.path, { folder: 'media/images' });
                imageUrls.push(uploadedImage.secure_url);
            }
        }

        if (req.files['video']) {
            const uploadedVideo = await cloudinary.uploader.upload(req.files['video'][0].path, {
                resource_type: 'video',
                folder: 'media/videos'
            });
            videoUrl = uploadedVideo.secure_url;
        }

        req.body.imageUrls = imageUrls;
        req.body.videoUrl = videoUrl;

        updateMedia(req, res);
    } catch (error) {
        console.error("Error updating media:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin-only route to delete specific media by media ID
router.delete('/delete/:mediaId', authMiddlewares('admin'), deleteMedia);

export default router;
