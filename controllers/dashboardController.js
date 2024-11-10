import Media from "../models/media.js";

export const subDetails = async (req, res) => {
    const category = req.params.category.trim();
// console.log(typeof(category))
    try {
        const media = await Media.aggregate([
            {
                // Match media documents based on the provided category
                $match: { categories: { $regex: new RegExp(`^${category}$`, 'i') } }
            },
            { 
                $limit: 50 
            },
            {
                // Lookup to join with the User collection to get user details
                $lookup: {
                    from: 'users',               // Reference to the 'users' collection
                    localField: 'userId',        // Field in Media to match on
                    foreignField: '_id',         // Field in User to match with
                    as: 'userInfo'               // Alias for user info
                }
            },
            { 
                $unwind: '$userInfo'            // Unwind userInfo array to make it a single object
            },
            {
                // Lookup to join with the Profile collection to get profile details
                $lookup: {
                    from: 'profiles',            // Reference to the 'profiles' collection
                    localField: 'userId',        // Field in Media to match on
                    foreignField: 'userId',      // Field in Profile to match with
                    as: 'profileInfo'            // Alias for profile info
                }
            },
            {
                $unwind: {
                    path: '$profileInfo',        // Unwind profileInfo array to make it a single object
                    preserveNullAndEmptyArrays: true  // Keep media even if no profile is found
                }
            },
            {
                // Project only the necessary fields from Media, User, and Profile models
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    url: 1,
                    categories: 1,
                    'userInfo.name': 1,                 // Name from User collection
                    'profileInfo.profilePicture': 1,    // Profile picture from Profile collection
                    like: 1,                            // Likes from Media collection
                    view: 1                             // Views from Media collection
                }
            }
        ]);

        // const media = await Media.find();
        // console.log('media',media)

        res.json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error("Error fetching media details:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
