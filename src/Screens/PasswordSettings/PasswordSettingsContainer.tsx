import { PasswordSettings } from "./PasswordSettings";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserTabScreens } from "..";
import { UserTabStackParamList } from "@/Navigation/Main/UserTab";
type PasswordSettingsNavigatorProps = NativeStackScreenProps<
    UserTabStackParamList,
    UserTabScreens.PASSWORD_SETTINGS
>;
export const PasswordSettingsContainer = ({navigation}:PasswordSettingsNavigatorProps) => {
  const onNavigate = (screen: UserTabScreens) => {
    navigation.navigate(screen);
};

  return <PasswordSettings onNavigate={onNavigate} goBack={navigation.goBack} canGoBack={navigation.canGoBack}/>;
};
