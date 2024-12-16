import React from "react";
import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./Main";
import { WelcomeContainer } from "@/Screens/Welcome";
import { RootScreens } from "@/Screens";
import { SignInContainer } from "@/Screens/SignIn";
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";
import { ShoppingListDetailContainer } from "@/Screens/ShoppingListDetail/ShoppingListDetailContainer";
import { ShoppingListByIdContainer } from "@/Screens/ShoppingListById/ShoppingListByIdContainer";

export type RootStackParamList = {
	[RootScreens.MAIN]: undefined;
	[RootScreens.WELCOME]: undefined;
	[RootScreens.SIGN_IN]: undefined;
	SHOPPING_LIST: undefined;
	SHOPPING_LIST_DETAIL: {groupId: string};
	SHOPPING_LIST_BY_ID: {groupId:string, shoppingId: string}
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// @refresh reset
const ApplicationNavigator = () => {
	return (
		<NavigationContainer>
			<StatusBar />
			<RootStack.Navigator initialRouteName={RootScreens.WELCOME} screenOptions={{ headerShown: true }}>
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
				<RootStack.Screen
					name={'SHOPPING_LIST'}
					component={ShoppingListContainer}
				/>
				<RootStack.Screen
				name="SHOPPING_LIST_DETAIL"
				component={ShoppingListDetailContainer}/>
				<RootStack.Screen
				name="SHOPPING_LIST_BY_ID"
				component={ShoppingListByIdContainer}/>
			</RootStack.Navigator>
		</NavigationContainer>
	);
};

export { ApplicationNavigator };
