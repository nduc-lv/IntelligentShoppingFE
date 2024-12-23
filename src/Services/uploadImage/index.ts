// api/upload.ts

export const uploadImageToCloudinary = async (
    uri: string,
    fileName: string = 'image.jpg',
    cloudName: string = 'dyqpebht7',
    uploadPreset: string = 'intelligent_shopping'
  ) => {
    try {
      // Tạo FormData và thêm các tham số
      const formData = new FormData();
      
      // Fetch image blob from URI
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // Thêm tệp vào formData
      formData.append('file', blob, fileName);
      formData.append('upload_preset', uploadPreset); // Upload preset của Cloudinary
      formData.append('cloud_name', cloudName); // Cloud Name của bạn
  
      // Thực hiện POST request tới Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      // Chờ Cloudinary trả về kết quả
      const data = await uploadResponse.json();
      
      if (data.secure_url) {
        return data.secure_url; // Trả về URL của ảnh đã tải lên
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error; // Đẩy lỗi ra ngoài để xử lý ở nơi gọi API
    }
  };
  