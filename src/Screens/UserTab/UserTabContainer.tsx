import { UserTab } from "./UserTab";
import React, { useState, useEffect } from "react";
import { useLazyGetMeQuery } from "@/Services";
import Loading from "@/General/Components/Loading";
import { RootScreens } from "..";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";

export const UserTabContainer = () => {

  const [fetchMe, { data, isSuccess, isLoading, isUninitialized, error }] =
  useLazyGetMeQuery();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const onNavigate = (screen: RootScreens) => {
    navigation.navigate(screen);
};
  useEffect(() => {
    fetchMe()
  }, [fetchMe]);
  return <UserTab data={isSuccess?data:null} isLoading={isUninitialized} onNavigate={onNavigate} />;
};
