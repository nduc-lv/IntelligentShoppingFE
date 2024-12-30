import React, { useState, useEffect, useMemo } from "react";
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
import { PasswordChangeRequest, useLoginWithoutCacheMutation, userApi, useUpdateMeMutation, useUpdatePasswordMutation } from "@/Services";
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


export const PasswordSettings = ({
  onNavigate,
  goBack,
  canGoBack
}: AccountSettingsProps) => {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    retype_password: ""
  });
  const passwordValidErros = useMemo(() => {
    if (!formData.new_password) {
      return [];
    }
    const errors = [];
    if (formData.new_password.length < 8) {
      errors.push(i18n.t(LocalizationKey.Password_must_be_at_least_8_characters_long));
    }
    if (!/[A-Z]/.test(formData.new_password)) {
      errors.push(i18n.t(LocalizationKey.Password_must_include_at_least_one_uppercase_letter));
    }
    if (!/[a-z]/.test(formData.new_password)) {
      errors.push(i18n.t(LocalizationKey.Password_must_include_at_least_one_lowercase_letter));
    }
    if (!/[0-9]/.test(formData.new_password)) {
      errors.push(i18n.t(LocalizationKey.Password_must_include_at_least_one_number));
    }
    if (!/[^A-Za-z0-9]/.test(formData.new_password)) {
      errors.push(i18n.t(LocalizationKey.Password_must_include_at_least_one_special_character));
    }
    return errors;
  }, [formData.new_password]);
  const isPasswordNotMatch = useMemo(() => !!formData.retype_password && formData.new_password != formData.retype_password, [formData.retype_password, formData.new_password]);
  const isPasswordUnchanged = useMemo(() => !!formData.old_password && formData.new_password == formData.old_password, [formData.retype_password, formData.new_password]);
  const isError = useMemo(() => isPasswordNotMatch || isPasswordUnchanged, [isPasswordNotMatch, isPasswordUnchanged]);
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (isError) {
      return;
    }
    let payload: PasswordChangeRequest = {
      old_password: formData.old_password,
      new_password: formData.new_password
    };
    try {
      await updatePassword(payload).unwrap();
      Toast.show({
        placement: "top",
        description: "Your password has been updated."
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
			<Text style={styles.label}>{i18n.t(LocalizationKey.OLD_PASSWORD)}</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Password"
        value={formData.old_password}
        onChangeText={(text) => handleInputChange("old_password", text)}
        secureTextEntry={true} />

			<Text style={styles.label}>{i18n.t(LocalizationKey.NEW_PASSWORD)}</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Password"
        value={formData.new_password}
        onChangeText={(text) => handleInputChange("new_password", text)}
        secureTextEntry={true} />

			{passwordValidErros.map((error) =>
      <Text style={styles.errorText}>{error}</Text>
      )}
			{isPasswordUnchanged ? <Text style={styles.errorText}>{i18n.t(LocalizationKey.PASSWORD_NOT_CHANGED_COMPARED_TO_PREV)}</Text> : null}
			<TextInput
        placeholderTextColor={"#9AA6B2"}
        style={styles.input}
        placeholder="Retype Password"
        value={formData.retype_password}
        onChangeText={(text) => handleInputChange("retype_password", text)}
        secureTextEntry={true} />

			{isPasswordNotMatch ? <Text style={styles.errorText}>{i18n.t(LocalizationKey.PASSWORD_NOT_MATCH)}</Text> : null}
			<View style={{ marginTop: 15 }}>
			<Button
          title={isLoading ? i18n.t(LocalizationKey.UPDATING) : i18n.t(LocalizationKey.UPDATE)}
          onPress={handleUpdate}
          disabled={isLoading || isError} />

			</View>
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
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 1
  }
});

export default PasswordSettings;