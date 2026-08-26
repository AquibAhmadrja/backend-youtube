import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.error("Cloudinary upload failed:", error.message)
        return null;
    }
}

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return null;

        const parts = cloudinaryUrl.split("/upload/");

        if (parts.length < 2) return null;

        let publicId = parts[1];

        // Remove version number
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove extension
        publicId = publicId.replace(/\.[^/.]+$/, "");

        const response = await cloudinary.uploader.destroy(publicId);

        return response;
    } catch (error) {
        console.log("Error deleting image from Cloudinary:", error.message);
        return null;
    }
};



export {uploadOnCloudinary,deleteFromCloudinary}