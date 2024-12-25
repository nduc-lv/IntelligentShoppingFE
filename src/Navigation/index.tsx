import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./Main";
import { WelcomeContainer } from "@/Screens/Welcome";
import { RootScreens } from "@/Screens";
import { SignInContainer } from "@/Screens/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/Store";
import { AuthState, fetchTokens } from "@/Store/reducers";
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";
import { ShoppingListDetailContainer } from "@/Screens/ShoppingListDetail/ShoppingListDetailContainer";
import { GroupDetailContainer } from "@/Screens/GroupDetail/GroupDetailContainer";
import { GroupContainer } from "@/Screens/Group/GroupContainer";
import { UsergroupContainer } from "@/Screens/Usergroup/UsergroupContainer";
import { AccountSettingsContainer } from "@/Screens/AccountSettings";
import { userApi } from "@/Services";
import Loading from "@/General/Components/Loading";
import { GroupInfoContainer } from "@/Screens/GroupInfo/GroupInfoContainer";
import { RecipeContainer } from "@/Screens/Recipe/RecipeContainer";
import { RecipeListContainer } from "@/Screens/RecipeList/RecipeListCointainer";
import { ManageContainer } from "@/Screens/Manage";
import { ManageAccountContainer } from "@/Screens/ManageAccount";
import { AdminNavigator } from "./Admin";
import { ManageFoodContainer } from "@/Screens/ManageFood";
import { ManageUnitContainer } from "@/Screens/ManageUnit";

import WarningBanner from "@/General/Components/WarningBanner";
import { i18n, LocalizationKey } from "@/Localization";
import { useNetInfo } from "@react-native-community/netinfo";

export type RootStackParamList = {
	[RootScreens.MAIN]: undefined;
	[RootScreens.WELCOME]: undefined;
	[RootScreens.SIGN_IN]: undefined;
	[RootScreens.ADMIN]: undefined;
	[RootScreens.ADMIN]: undefined;
	SHOPPING_LIST: undefined;
	SHOPPING_LIST_DETAIL: { groupId: string };
	GROUP_DETAIL: { groupId: string, isAdmin: boolean };
	GROUP: undefined;
	GROUP_INFO: { groupId: string, isAdmin: boolean };
	USERGROUP: { groupId: string, isAdmin: boolean, groupName: string };
	MANAGE: undefined;
	MANAGE_ACCOUNT: undefined;
	MANAGE_FOOD: undefined;
	MANAGE_UNIT: undefined;
	RECIPE: undefined;
	RECIPE_DETAIL: { recipeId: string };
	RECIPE_LIST: undefined;
	EDIT_RECIPE: { recipeId: string };
};
const PublicScreens: Set<string | undefined> = new Set(
	[
		RootScreens.SIGN_IN,
		RootScreens.WELCOME
	]

)
export const RootStack = createNativeStackNavigator<RootStackParamList>();
export const RootNavigationContainerRef = createNavigationContainerRef<RootStackParamList>()

// @refresh reset
const ApplicationNavigator = () => {
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
	return <_ApplicationNavigator />
}
const _ApplicationNavigator = () => {
	const dispatch = useDispatch<AppDispatch>()
	const accessToken = useSelector(
		(state: { auth: AuthState }) => state.auth.accessToken
	);
	const currentRoute = RootNavigationContainerRef.current?.getCurrentRoute()?.name

	const { type, isConnected } = useNetInfo();
	const [getMe, { isLoading, error, data }] = userApi.useLazyGetMeQuery();
	useEffect(() => {
		if (!accessToken) {
			dispatch(fetchTokens())
		} else {
			getMe();
		}
	}, [accessToken])
	useEffect(() => {
		console.log(data)
		if (!PublicScreens.has(currentRoute)) {
			if ((!isLoading && !data)) {
				RootNavigationContainerRef.navigate(RootScreens.SIGN_IN)
			}
		} else {
			if (data) {
				RootNavigationContainerRef.navigate(RootScreens.MAIN)
			}
		}


	}, [accessToken, currentRoute, isLoading, data, error]);

	if (isLoading) {
		return <Loading />;
	}
	return (
		<NavigationContainer ref={RootNavigationContainerRef}>
			<StatusBar />
			<WarningBanner hidden={!isConnected} description={i18n.t(LocalizationKey.NETWORK_NOT_CONNECTED)} />
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
				<RootStack.Screen
					name={'SHOPPING_LIST'}
					component={ShoppingListContainer}
				/>
				<RootStack.Screen
					name="SHOPPING_LIST_DETAIL"
					component={ShoppingListDetailContainer} />
				<RootStack.Screen
					name="GROUP_DETAIL"
					component={GroupDetailContainer} />
				<RootStack.Screen
					name="GROUP_INFO"
					component={GroupInfoContainer} />
				<RootStack.Screen
					name="GROUP"
					component={GroupContainer} />
				<RootStack.Screen
					name="USERGROUP"
					component={UsergroupContainer} />
				<RootStack.Screen
					name={"MANAGE"}
					component={ManageContainer}
				/>
				<RootStack.Screen
					name={"MANAGE_ACCOUNT"}
					component={ManageAccountContainer}
				/>
				<RootStack.Screen
					name={"MANAGE_FOOD"}
					component={ManageFoodContainer}
				/>
				<RootStack.Screen
					name={"MANAGE_UNIT"}
					component={ManageUnitContainer}
				/>

			</RootStack.Navigator>
		</NavigationContainer>
	);
};

export { ApplicationNavigator };
