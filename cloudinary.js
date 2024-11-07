import cloudinary from 'cloudinary';
import fs from 'fs'


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwc1kyrwy',
  api_key:process.env.CLOUDINARY_API_KEY || '587661277666165',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mQHa2_jisA1e_xXhqVtCbWsEYj0'
});


const uploaddOnCloudinary = async(localFilepath) => {
    try {
        if(!localFilepath) return null
        const respose = await cloudinary.uploader.upload(localFilepath, {
            resource_type: 'auto',
        });
        console.log(respose.url)
        fs.unlinkSync(localFilepath)
        return respose

    } catch (error) {
        fs.unlinkSync(localFilepath);
        return null;
    }
}

export default uploaddOnCloudinary;