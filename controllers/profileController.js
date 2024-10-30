import Profile from "../models/profile.js";


export const createOrUpdateProfile = async (req, res) => {
    const  userId  = req.user.id;
    console.log("userId:", userId)
    const { bio, profilePicture, contactDetails, location, skills, socialLinks } = req.body;

    try {
        let profile = await Profile.findOne({userId});
        console.log("profile Id:", profile)
        
        if(profile) {
            profile.bio = bio || profile.bio
            profile.profilePicture = profilePicture || profile.profilePicture
            profile.contactDetails = contactDetails || profile.contactDetails
            profile.location = location || profile.location
            profile.skills = skills || profile.skills
            profile.socialLinks = socialLinks || profile.socialLinks

            await profile.updateOne();
            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                profile
            });
        }
        else{
            profile = new Profile({
                userId,
                bio,
                profilePicture,
                contactDetails,
                location,
                skills,
                socialLinks
            });
            console.log("New profile:", profile)

            await profile.save();
            return res. status(200).json({
                success: true,
                message: 'Profile created successfully',
                profile
            });
        }
    } catch (error) {
        console.error("Error in createdprofile:", error)
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getProfile = async(req, res) => {
    const  userId  = req.user.id;
    console.log("Fetching profile for userId:", userId);

    try {
        const profile = await Profile.findOne({userId}).populate('userId', 'name email');

        if(!profile) {
            return res.status(404).json({
                success:false,
                message: 'Profile not found',
            });
        }

        return res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        console.error("Error in getProfile:", error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};