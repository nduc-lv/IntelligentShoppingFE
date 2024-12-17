import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./Main";
import { WelcomeContainer } from "@/Screens/Welcome";
import { RootScreens } from "@/Screens";
import { SignInContainer } from "@/Screens/SignIn";
import { AccountSettingsContainer } from "@/Screens/AccountSettings";
import { userApi } from "@/Services";
import Loading from "@/General/Components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/Store";
import { AuthState, fetchTokens } from "@/Store/reducers";

export type RootStackParamList = {
	[RootScreens.MAIN]: undefined;
	[RootScreens.WELCOME]: undefined;
	[RootScreens.SIGN_IN]: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
export const RootNavigationContainerRef = createNavigationContainerRef<RootStackParamList>()

// @refresh reset
const ApplicationNavigator=  ()=>{
	const dispatch = useDispatch<AppDispatch>();
	const authInitialized = useSelector(
		(state: { auth: AuthState }) => state.auth.initialized
	);
	useEffect(() => {
		if (!authInitialized) {
			dispatch(fetchTokens());
		}
	}, [authInitialized]);
	if (!authInitialized) {
		return <Loading />;
	}
	return <_ApplicationNavigator/>
}
const _ApplicationNavigator = () => {
	const accessToken = useSelector(
		(state: { auth: AuthState }) => state.auth.accessToken
	);
	const currentRoute=RootNavigationContainerRef.current?.getCurrentRoute()?.name
	useEffect(() => {
		if (!accessToken&&currentRoute!=RootScreens.SIGN_IN) {
			RootNavigationContainerRef.navigate(RootScreens.SIGN_IN)
		}
	}, [accessToken,currentRoute]);
	const [getMe, { isLoading, error, data }] = userApi.useLazyGetMeQuery();
	useEffect(() => {
		getMe();
	}, []);
	if (isLoading) {
		return <Loading />;
	}
	return (
		<NavigationContainer ref={RootNavigationContainerRef}>
			<StatusBar />
			<RootStack.Navigator
				initialRouteName={data ? RootScreens.MAIN : RootScreens.WELCOME}
				screenOptions={{ headerShown: false }}
			>
				<RootStack.Screen
					name={RootScreens.WELCOME}
					component={WelcomeContainer}
				/>
				<RootStack.Screen
					name={RootScreens.MAIN}
					component={MainNavigator}
					options={{}}
				/>
				<RootStack.Screen
					name={RootScreens.SIGN_IN}
					component={SignInContainer}
				/>
			</RootStack.Navigator>
		</NavigationContainer>
	);
};

export { ApplicationNavigator };
