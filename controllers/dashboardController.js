import Media from "../models/media";

export const subDetails = async(req,res) => {
    const {category} = req.params;
    try {
        const media = await Media.aggregate([
            {$match: {categories: category}},
            {$limit: 50}
        ]);
        res.json(media);
    } catch (error) {
        console.error("Error in category");

    }
}