import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./Main";
import { WelcomeContainer } from "@/Screens/Welcome";
import { RootScreens } from "@/Screens";
import { SignInContainer } from "@/Screens/SignIn";
import { userApi } from "@/Services";
import Loading from "@/General/Components/Loading";

export type RootStackParamList = {
	[RootScreens.MAIN]: undefined;
	[RootScreens.WELCOME]: undefined;
	[RootScreens.SIGN_IN]: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// @refresh reset
const ApplicationNavigator = () => {
	const [getMe, { isLoading, error, data }] = userApi.useLazyGetMeQuery();
	useEffect(() => {
		getMe();
	}, []);
	if (isLoading) {
		return <Loading/>
	}
	return (
		<NavigationContainer>
			<StatusBar />
			<RootStack.Navigator
				initialRouteName={data ? RootScreens.MAIN : RootScreens.WELCOME}
				screenOptions={{ headerShown: true }}
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
