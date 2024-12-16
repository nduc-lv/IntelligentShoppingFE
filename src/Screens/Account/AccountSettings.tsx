import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Switch, StyleSheet, Alert } from "react-native";
import { User } from "@/Store/types";
import { useLazyGetMeQuery, useUpdateMeMutation } from "@/Services";
import { Toast } from "native-base";
import { RootScreens } from "..";
export interface AccountSettingsProps {
  onNavigate:(screen:RootScreens)=>void,
  goBack:()=>void,
  canGoBack:()=>boolean,
}
export const AccountSettings = ({onNavigate,goBack,canGoBack}:AccountSettingsProps) => {
  const [fetchMe, { data: user, isFetching }] = useLazyGetMeQuery();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    link_avatar: "",
  });

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        link_avatar: user.link_avatar || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateMe(formData).unwrap();
      Toast.show({placement: "top",description:"Your account has been updated."});
      if(canGoBack()){
        goBack()
      } else{
        onNavigate(RootScreens.MAIN)
      }
    } catch (error) {
      Toast.show({placement:"top",description:"Failed to update account settings."});
    }
  };

  if (isFetching) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: formData.link_avatar }} style={styles.avatar} />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Avatar Link"
        value={formData.link_avatar}
        onChangeText={(text) => handleInputChange("link_avatar", text)}
      />
      <Button title={isLoading ? "Updating..." : "Update"} onPress={handleUpdate} disabled={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});

export default AccountSettings;
