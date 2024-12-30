import { UserTab } from "./UserTab";
import React, { useState, useEffect } from "react";
import Loading from "@/General/Components/Loading";
import { RootScreens, UserTabScreens } from "..";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { UserTabStackParamList } from "@/Navigation/Main/UserTab";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthState } from "@/Store/reducers";
import { useSelector } from "react-redux";
type AccountSettingsNavigatorProps = NativeStackScreenProps<
  UserTabStackParamList,
  UserTabScreens.USER_TAB_MAIN>;

export const UserTabContainer = ({ navigation }: AccountSettingsNavigatorProps) => {
  const data = useSelector((state: { auth: AuthState }) => state.auth.user);

  const onNavigate = (screen: UserTabScreens) => {
    navigation.navigate(screen);
  };
  return (
    <UserTab
      data={data}
      isLoading={!data}
      onNavigate={onNavigate} />);


};