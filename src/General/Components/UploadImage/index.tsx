import React, { useState } from 'react';
import { View, Text, Button, Image, Alert, ActivityIndicator } from 'react-native';
import { launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';

const UploadImage: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo', // Chỉ cho phép chọn ảnh
        quality: 1,         // Chất lượng ảnh
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          Alert.alert('Thông báo', 'Bạn đã hủy chọn ảnh');
        } else if (response.errorCode) {
          Alert.alert('Lỗi', `Có lỗi xảy ra: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage: Asset = response.assets[0];
          setImageUri(selectedImage.uri || null); // Lưu URI của ảnh
        }
      }
    );
  };

  const handleUploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Thông báo', 'Vui lòng chọn ảnh trước!');
      return;
    }

    try {
      setLoading(true);

      // Upload ảnh lên server (Cloudinary hoặc server của bạn)
      // Đây là ví dụ giả lập
      const fakeUploadUrl = `https://my-server.com/uploaded-image-${Date.now()}`;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Giả lập thời gian upload

      Alert.alert('Thành công', `Ảnh đã được tải lên: ${fakeUploadUrl}`);
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Lỗi', 'Upload ảnh không thành công!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Chọn ảnh" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      <View style={{ marginTop: 20 }}>
        <Button title="Upload ảnh" onPress={handleUploadImage} />
      </View>
    </View>
  );
};

export default UploadImage;
