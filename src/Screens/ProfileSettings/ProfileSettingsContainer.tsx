import { ProfileSettings } from "./ProfileSettings";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserTabScreens } from "..";
import { UserTabStackParamList } from "@/Navigation/Main/UserTab";
type ProfileSettingsNavigatorProps = NativeStackScreenProps<
  UserTabStackParamList,
  UserTabScreens.PROFILE_SETTINGS>;

export const ProfileSettingsContainer = ({ navigation }: ProfileSettingsNavigatorProps) => {
  const onNavigate = (screen: UserTabScreens) => {
    navigation.navigate(screen);
  };

  return <ProfileSettings onNavigate={onNavigate} goBack={navigation.goBack} canGoBack={navigation.canGoBack} />;
};