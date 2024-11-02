import multer from 'multer';
import fs from 'fs';
import path from 'path';
// import path from 'path';
// import User from '../models/user.js';
import Media from '../models/media.js'
import { fileURLToPath } from 'url';




// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb)=> {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // Initialize multer

// const upload = multer({ storage });

// // Upload profile photo (admin only)
// export const uploadProfilePhoto = async(req, res) => {
//     const { userId } = req.user;

//     if(!req.file) {
//         return res.status(400).json({
//             success: false,
//             message: 'No file uploaded'
//         });
//     }

//     // Here you can update the user profile with the uploaded profile picture URL
//     const profilePictureUrl = req.file.path;

//     try {
//         await User.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl}, { new:true });

//         return res.status(200).json({
//             success: true,
//             message: 'Profile photo uploaded successfully',
//             profilePictureUrl
//         });
//     } catch (error) {
//         console.error("Error updating user profile");
//         return res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

// // upload media (admin only)
// export const uploadMedia = upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]);
// export const profilePicture = upload.single('profilePicture');
//****************************************************************************************************************** */
// export const createMedia = async (req, res) => {
//     const { title, description, hide } = req.body;
//     const imageUrls = req.files['images'] ? req.files['images'].map(file => file.path) : [];
//     const videoUrl = req.files['video'] ? req.files['video'][0].path : null;

//     // if(!imageUrls.length === 0 && !videoUrl) {
//     //     return res.status(400).json({
//     //         success: false,
//     //         message: 'At least one image or video must be uploaded'
//     //     });
//     // }

//     try {
//         // crete media entries for images
//         for (const url of imageUrls) {
//             const media = new Media({
//                 userId: req.user._id,
//                 title: title || 'Untitled',
//                 description: description || '',
//                 mediaType: 'image',
//                 url,
//                 hide
//             });
//             await media.save();
//         }

//         // create media entry for video if it exists
//         if(videoUrl) {
//             const media = new Media({
//                 userId: req.user._id,
//                 title: title || 'Untitled video',
//                 description: description || '',
//                 mediaType: 'video',
//                 url: videoUrl,
//                 hide
//             });
//             await media.save();
//         }

//         return res.status(200).json({
//             success:true,
//             message: 'Media uploaded successfully',
//         });

// } catch (error) {
//     console.error('Error in createMedia:', error);
//     return res.status(500).json({
//         success: false,
//         message: 'Server error '
//     });
// }
// };
//**************************************************************************************************************** */
//Multer configuration to handle file upload in memory
// const storage = multer.diskStorage();
// const upload = multer({
//     storage,
//     limits: {fileSize: 10*1024*1024},
// });


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "/public/temp")
//     },
//     filename: function (req, file, cb) {

//         cb(null, file.originalname)
//     }
// })

// export const upload = multer({
//     storage,
// })

// //Middleware to handle profile picture uploads
// export const profilePicture = upload.single('profilePicture');

// // //Middleware to handle media upload (up to 5 images and 1 video)
// export const uploadMedia = upload.fields([
//     { name: 'images', maxCount: 5 },
//     { name: 'video', maxCount: 1 }
// ]);

// export default upload;
//**************************************************************************************************************** */

export const createMedia = async (req, res) => {
    const { title, description, hide } = req.body;
    const imageUrls = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const videoUrl = req.files['video'] ? req.files['video'][0].path : null;
  
    try {
      // Create media entries for images
      for (const url of imageUrls) {
        const media = new Media({
          userId: req.user._id,
          title: title || 'Untitled',
          description: description || '',
          mediaType: 'image',
          url,
          hide,
        });
        await media.save();
      }
  
      // Create media entry for video if it exists
      if (videoUrl) {
        const media = new Media({
          userId: req.user._id,
          title: title || 'Untitled video',
          description: description || '',
          mediaType: 'video',
          url: videoUrl,
          hide,
        });
        await media.save();
      }
  
      return res.status(200).json({
        success: true,
        message: 'Media uploaded successfully',
      });
    } catch (error) {
      console.error('Error in createMedia:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, './public/temp');
  
      // Check if the directory exists
      if (!fs.existsSync(dir)) {
        // If not, create it
        fs.mkdirSync(dir, { recursive: true });
      }
  
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
  });

  export const profilePicture = upload.single('profilePicture');

// //Middleware to handle media upload (up to 5 images and 1 video)
export const uploadMedia = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
]);
  