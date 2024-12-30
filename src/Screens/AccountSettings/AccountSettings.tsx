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


export const AccountSettings = ({ onNavigate }: AccountSettingsProps) => {
  const settings: Array<UserTabListItem> = [
  {
    title: i18n.t(LocalizationKey.CHANGE_PASSWORD),
    icon: KeySquareIcon,
    onClick: (e) => {
      onNavigate(UserTabScreens.PASSWORD_SETTINGS);
    }
  },
  {
    title: i18n.t(LocalizationKey.CHANGE_PROFILE_INFORMATION),
    icon: FileUserIcon,
    onClick: (e) => {
      onNavigate(UserTabScreens.PROFILE_SETTINGS);
    }
  }];

  return (
    <ScrollView>
			<FlatList
        data={settings}
        renderItem={renderUserTabListItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ marginTop: 16 }}
        scrollEnabled={false} />

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

export default AccountSettings;