import uploaddOnCloudinary from "../cloudinary.js";
import Profile from "../models/profile.js";

export const createProfile = async(req, res) => {
    const userId = req.user.id;
    const {contactDetails, location, bio, socialLinks, skills, availability} = req.body;

    try {
        const profile = await Profile.findOne({userId});
        if(profile) {
            return res.status(400).json({
                success: false,
                message: 'profile already created'
            });
        }

        // const profilePath = req.files?.profilePicture[0].path;
        // console.log(profilePath,'ProfilePath');

        // const profileResponse = await uploaddOnCloudinary(profilePath);
        // console.log(profileResponse,'profileResponse');

        // if(!profileResponse) {
        //     return res.status(404).json({
        //         success: false,
        //         messahe: 'failed to upload file on cloudinary'
        //     });
        // }

        const newProfile = new Profile({
            userId,
            contactDetails,
            location,
            bio,
            socialLinks,
            skills,
            availability,
        });

        await newProfile.save();

        return res.status(200).json({
            success: true,
            message: 'Profile created successfully',
            newProfile
        })
    } catch (error) {
        console.error("Error in created profile", error)
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const uploadProfilePicture = async(req, res) => {
    const userId = req.user.id;

    try {
        const profile = await Profile.findOne({userId});
        if(!profile) {
            return res.status(400).json({
                success: false,
                message:'User not find'
            });
        }

        const profileImagePath = req.files?.profilePicture[0].path;
        console.log(profileImagePath, 'profilePath');

        const profileResponse = await uploaddOnCloudinary(profileImagePath);
        console.log(profileResponse,'profileresponse');

        profile.profilePicture = profileResponse.url;
        await profile.save();

        return res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: {profilePicture: profile.profilePicture}
        });

    } catch (error) {
        console.error("Erorr in profile photo uploading", error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};