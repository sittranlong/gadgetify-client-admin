import {defineStore} from "pinia";
import axios from "axios";

const useCloudinaryStore = defineStore('cloudinary', () => {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/daft8gwa9/image/upload';
    const uploadPreset = 'gadgetify';
    const upload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        const response = await axios.post(cloudinaryUrl, formData);
        return {
            secure_url: response?.data?.secure_url,
            public_id: response?.data?.public_id,
        }
    }
    const deleteImage = async (publicId) => {
        await axios.delete(`/cloudinary/${publicId}`);
    }
    return {upload, deleteImage};
});
export default useCloudinaryStore;