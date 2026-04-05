import cloudinary from "./cloudinary.service.js";

export const uploadFile = async ({ filePath, folder } = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFiles = async ({ files, folder } = {}) => {
  try {
    const coverPictures = await Promise.all(
      files.map(async (file) => {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          file.path,
          { folder },
        );
        return { public_id, secure_url };
      }),
    );
    return coverPictures;
  } catch (error) {
    console.log(error);
  }
};