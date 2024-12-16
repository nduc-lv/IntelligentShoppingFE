import { AccountSettings } from "./AccountSettings";
import React, { useState, useEffect } from "react";
import { useLazyGetMeQuery } from "@/Services";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
type AccountSettingsNavigatorProps = NativeStackScreenProps<
    RootStackParamList,
    RootScreens.SIGN_IN
>;
export const AccountSettingsContainer = ({navigation}:AccountSettingsNavigatorProps) => {
  const onNavigate = (screen: RootScreens) => {
    navigation.navigate(screen);
};

  return <AccountSettings onNavigate={onNavigate} goBack={navigation.goBack} canGoBack={navigation.canGoBack}/>;
};
