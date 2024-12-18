import { AccountSettings } from "./AccountSettings";
import React, { useState, useEffect } from "react";
import { useLazyGetMeQuery } from "@/Services";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserTabScreens } from "..";
import { UserTabStackParamList } from "@/Navigation/Main/UserTab";
type AccountSettingsNavigatorProps = NativeStackScreenProps<
    UserTabStackParamList,
    UserTabScreens.ACCOUNT_SETTING
>;
export const AccountSettingsContainer = ({navigation}:AccountSettingsNavigatorProps) => {
  const onNavigate = (screen: UserTabScreens) => {
    navigation.navigate(screen);
};

  return <AccountSettings onNavigate={onNavigate} goBack={navigation.goBack} canGoBack={navigation.canGoBack}/>;
};
