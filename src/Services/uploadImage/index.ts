import * as ImagePicker from "expo-image-picker";

export const uploadImageToCloudinary = async (
  uri: string,
  cloudName: string = "dyqpebht7",
  uploadPreset: string = "intelligent_shopping"
) => {
  try {
    const formData = new FormData();
    // Đọc ảnh từ URI và tạo đối tượng FormData
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const file = {
      uri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    };

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    // Gửi ảnh lên Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadResponse.json();

    if (data.secure_url) {
      return data.secure_url; // Trả về URL của ảnh đã tải lên
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
