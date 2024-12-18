import { UserTab } from "./UserTab";
import React, { useState, useEffect } from "react";
import { useLazyGetMeQuery } from "@/Services";
import Loading from "@/General/Components/Loading";
import { RootScreens, UserTabScreens } from "..";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { UserTabStackParamList } from "@/Navigation/Main/UserTab";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type AccountSettingsNavigatorProps = NativeStackScreenProps<
    UserTabStackParamList,
    UserTabScreens.USER_TAB_MAIN
>;
export const UserTabContainer = ({navigation}:AccountSettingsNavigatorProps) => {
	const [fetchMe, { data, isSuccess, isLoading, isUninitialized, error }] =
		useLazyGetMeQuery();
	const onNavigate = (screen: UserTabScreens) => {
		navigation.navigate(screen);
	};
	useEffect(() => {
		fetchMe();
	}, [fetchMe]);
	return (
		<UserTab
			data={isSuccess ? data : null}
			isLoading={isUninitialized}
			onNavigate={onNavigate}
		/>
	);
};
