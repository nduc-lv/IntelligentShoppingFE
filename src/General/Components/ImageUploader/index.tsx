import React, { useState } from "react";
import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { uploadImageToCloudinary } from "@/Services/uploadImage";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void }


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleSelectAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      setLoading(true);
      try {
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        onImageUpload(uploadedUrl);
        Alert.alert("Thông báo", "Ảnh đã được tải lên thành công!");
      } catch (error) {
        Alert.alert("Lỗi", "Upload ảnh không thành công!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TouchableOpacity
      style={{
        height: 48,
        width: 48,
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        marginLeft: 'auto'
      }}
      onPress={handleSelectAndUploadImage}>

            {loading ?
      <ActivityIndicator size="small" color="#333" /> :

      <Camera size={24} color="#333" />
      }
        </TouchableOpacity>);

};

export default ImageUploader;