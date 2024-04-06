import cloudinary, { UploadApiResponse } from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dgcdhdk2e',
  api_key: '516921479487855',
  api_secret: '9KczecD37bSGvgmT4jO7Bb90Py8',
});

export const uploadImage = async (image) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result: UploadApiResponse = await cloudinary.v2.uploader.upload(
      image.path,
      options,
    );
    return result.url;
  } catch (error) {
    console.error(error, 'in pic upload err');
    return error;
  }
};
