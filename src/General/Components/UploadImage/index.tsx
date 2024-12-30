import { i18n, Language, LocalizationKey } from "@/Localization";import { uploadImageToCloudinary } from '@/Services/uploadImage';
import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const UploadImage: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Chọn ảnh từ thư viện
  const selectImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 }, // chỉ chọn ảnh
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const selectedImage = response.assets ? response.assets[0] : null;
          if (selectedImage && selectedImage.uri) {
            setImageUri(selectedImage.uri); // Lưu URI ảnh đã chọn
          }
        }
      }
    );
  };

  // Xử lý upload ảnh (nếu có chọn ảnh)
  const handleUploadImage = async () => {
    if (imageUri) {// Kiểm tra nếu có ảnh
      try {
        setLoading(true);
        const uploadedUrl = await uploadImageToCloudinary(imageUri, 'image.jpg');
        setImageUrl(uploadedUrl); // Lưu URL ảnh đã tải lên
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Upload ảnh không thành công!');
      } finally {
        setLoading(false);
      }
    } else {
      // Nếu không chọn ảnh, thông báo cho người dùng
      Alert.alert('Thông báo', 'Bạn chưa chọn ảnh!');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Chọn ảnh" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      <View style={{ marginTop: 20 }}>
        <Button title="Upload ảnh lên Cloudinary" onPress={handleUploadImage} />
      </View>
      {imageUrl ? <Text>{i18n.t(LocalizationKey.IMAGE_UPLOADED)} {imageUrl}</Text> : null}
    </View>);

};

export default UploadImage;