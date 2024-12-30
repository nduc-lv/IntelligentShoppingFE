import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Switch,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList } from
"react-native";
import { User } from "@/Store/types";
import { userApi, useUpdateMeMutation } from "@/Services";
import { Toast } from "native-base";
import { UserTabScreens } from "..";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import Loading from "@/General/Components/Loading";
import AppConfig from "@/General/Constants/AppConfig";
import { renderUserTabListItem, UserTabListItem } from "@/General/Components/UserTabItem";
import { i18n, LocalizationKey } from "@/Localization";
import { FileUserIcon, KeySquareIcon } from "lucide-react-native";
export interface AccountSettingsProps {
  onNavigate: (screen: UserTabScreens) => void,
  goBack: () => void,
  canGoBack: () => boolean, }


export const ProfileSettings = ({
  onNavigate,
  goBack,
  canGoBack
}: AccountSettingsProps) => {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    link_avatar: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        link_avatar: user.link_avatar || AppConfig.defaultAvatar
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    let payload: any = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }
    try {
      await updateMe(payload).unwrap();
      Toast.show({
        placement: "top",
        description: "Your account has been updated."
      });
      if (canGoBack()) {
        goBack();
      } else {
        onNavigate(UserTabScreens.USER_TAB_MAIN);
      }
    } catch (error) {
      Toast.show({
        placement: "top",
        description: "Failed to update account settings."
      });
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
			<Image
        source={{ uri: formData.link_avatar ??AppConfig.defaultAvatar}}
        style={styles.avatar}
        defaultSource={{ uri: AppConfig.defaultAvatar }} />


			<Text style={styles.label}>{i18n.t(LocalizationKey.NAME)}</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)} />


			<Text style={styles.label}>{i18n.t(LocalizationKey.EMAIL)}</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address" />


			<Text style={styles.label}>{i18n.t(LocalizationKey.USERNAME)}</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)} />


			<Text style={styles.label}>{i18n.t(LocalizationKey.AVATAR_LINK)}</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Avatar Link"
        value={formData.link_avatar}
        onChangeText={(text) => handleInputChange("link_avatar", text)} />

			<Button
        title={isLoading ? i18n.t(LocalizationKey.UPDATING) : i18n.t(LocalizationKey.UPDATE)}
        onPress={handleUpdate}
        disabled={isLoading} />

		</ScrollView>);

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10
  }
});

export default ProfileSettings;