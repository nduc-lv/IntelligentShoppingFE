import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CommonActions, createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./Main";
import { WelcomeContainer } from "@/Screens/Welcome";
import { AdminScreens, RootScreens } from "@/Screens";
import { SignInContainer } from "@/Screens/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/Store";
import { AuthState, clearTokens, fetchTokens, setMe } from "@/Store/reducers";
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
import { ShoppingListByIdContainer } from "@/Screens/ShoppingListById/ShoppingListByIdContainer";
import { ManageContainer } from "@/Screens/Manage";
import { ManageAccountContainer } from "@/Screens/ManageAccount";
import { AdminNavigator } from "./Admin";
import { ManageFoodContainer } from "@/Screens/ManageFood";
import { ManageUnitContainer } from "@/Screens/ManageUnit";
import * as Notifications from 'expo-notifications';
import WarningBanner from "@/General/Components/WarningBanner";
import { i18n, LocalizationKey } from "@/Localization";
import { useNetInfo } from "@react-native-community/netinfo";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { selectAccessToken, selectUser } from "@/Store/reducers";
import { Config } from "@/General/Config";
import axios from 'axios'
import { usePushNotifications } from "usePushNotification";
import { useNavigation } from "expo-router";
import ExpoNoti from "@/General/Components/ExpoNoti";
import { MenuCalendarContainer } from "@/Screens/MenuCalendar/MenuCalendarContainer";
export type RootStackParamList = {
	[RootScreens.MAIN]: undefined;
	[RootScreens.WELCOME]: undefined;
	[RootScreens.SIGN_IN]: undefined;
	[RootScreens.ADMIN]: undefined;
	SHOPPING_LIST: undefined;
	SHOPPING_LIST_DETAIL: { groupId: string };
	SHOPPING_LIST_BY_ID: { groupId: string, shoppingId: string };
	GROUP_DETAIL: { groupId: string, isAdmin: boolean };
	GROUP: undefined;
	GROUP_INFO: { groupId: string, isAdmin: boolean };
	USERGROUP: { groupId: string, isAdmin: boolean, groupName: string };
	MANAGE: undefined;
	[AdminScreens.MANAGE_ACCOUNT]: undefined;
	MANAGE_FOOD: undefined;
	[AdminScreens.MANAGE_UNIT]: undefined;
	RECIPE: undefined;
	RECIPE_DETAIL: { recipeId: string, isMyRecipe: boolean };
	RECIPE_LIST: undefined;
	EDIT_RECIPE: { recipeId: string };
	MENU_CALENDAR: { groupId: string, isAdmin: boolean };
};
const PublicScreens: Set<string | undefined> = new Set(
	[
		RootScreens.SIGN_IN,
		RootScreens.WELCOME
	]

)
export const RootStack = createNativeStackNavigator<RootStackParamList>();
export const RootNavigationContainerRef = createNavigationContainerRef<RootStackParamList>()

const pushToken = async (token: {data:string}, userId:string) => {
	try {
		await axios.post(
			`${Config.API_URL}/token/add/${userId}`,
			{ token: token.data },
		);
		console.log("Push token sent to the backend successfully!");
	} catch (error) {
		console.error("Failed to send push token to backend:", error);
	}
}
// @refresh reset
const ApplicationNavigator = () => {
	const user = useSelector(selectUser)
	const { expoPushToken, notification } = usePushNotifications();
	if (user && user.id && expoPushToken) {
		pushToken(expoPushToken, user.id)
	}
	return <_ApplicationNavigator />
}
const _ApplicationNavigator = () => {
	const dispatch = useDispatch<AppDispatch>()
	const accessToken = useSelector(
		(state: { auth: AuthState }) => state.auth.accessToken
	);
	const initializedAuth = useSelector(
		(state: { auth: AuthState }) => state.auth.initialized
	);
	const currentRoute = RootNavigationContainerRef.current?.getCurrentRoute()?.name

	const { type, isConnected } = useNetInfo();
	const getMeQuery = userApi.useGetMeQuery(accessToken ? {} as unknown as void : skipToken);
	useEffect(() => {
		console.log("AccessToken changed " + accessToken)
		// use cleartokens for logout
		if (!accessToken) {
			dispatch(fetchTokens())
		}
		console.log(isConnected)
		console.log(!getMeQuery.isFetching)

		if (accessToken && isConnected && !getMeQuery.isFetching) {
			console.log("Refetch issued "+accessToken)
			getMeQuery.refetch()
		}
	}, [accessToken, isConnected])
	useEffect(() => {
		console.log(`Fetching state : ${getMeQuery.isFetching}`)
		console.log(`Fetching : ${getMeQuery.data}`)
	},[getMeQuery.isFetching])
	useEffect(()=>{
		if(getMeQuery.error){
			dispatch(setMe(null))
		} else{
			dispatch(setMe(getMeQuery.data??null))
		}
	},[getMeQuery.data,getMeQuery.error])
	const isGettingMe=useMemo(()=>!initializedAuth||getMeQuery.isLoading||getMeQuery.isFetching,[initializedAuth,getMeQuery.isLoading,getMeQuery.isFetching])
	const isLoggedin=useMemo(()=>!!accessToken&&!!getMeQuery.data&&!!!getMeQuery.error,[getMeQuery.data,getMeQuery.error,accessToken])
	const [navOnReadyIncrement,setNavOnReadyIncrement]=useState(0);
	useEffect(()=>{
		if(!RootNavigationContainerRef.isReady()){
			return 
		}
		if(PublicScreens.has(currentRoute)){
			if(isLoggedin){
				console.log("NAV MAIN")
				RootNavigationContainerRef.dispatch(
					CommonActions.reset({
					  index: 0,
					  routes: [{ name: RootScreens.MAIN }],
					})
				  );
			}
		} else {
			if ((initializedAuth && !accessToken)) {
				console.log("NAV")
				RootNavigationContainerRef.dispatch(
					CommonActions.reset({
					  index: 0,
					  routes: [{ name: RootScreens.SIGN_IN }],
					})
				  );
			} else if (!isGettingMe) {
				if (!isLoggedin) {
				console.log("NAV!!")
					dispatch(clearTokens())
					RootNavigationContainerRef.dispatch(
						CommonActions.reset({
						  index: 0,
						  routes: [{ name: RootScreens.SIGN_IN }],
						})
					  );
				}
			}
		}

	},[accessToken,initializedAuth,isLoggedin,navOnReadyIncrement])
	if (isGettingMe) {
		return <Loading />;
	}
	return (
		<NavigationContainer ref={RootNavigationContainerRef} onReady={()=>{
			setNavOnReadyIncrement((val)=>(val+1))
		}}
		>
			<ExpoNoti />
			<WarningBanner hidden={!!isConnected} description={i18n.t(LocalizationKey.NETWORK_NOT_CONNECTED)} />
			<RootStack.Navigator
				initialRouteName={RootScreens.WELCOME}
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
					name={RootScreens.ADMIN}
					component={AdminNavigator}
				/>
				{/* <RootStack.Screen
					name={'SHOPPING_LIST'}
					component={ShoppingListContainer}
				/>
				<RootStack.Screen
					name="SHOPPING_LIST_DETAIL"
					component={ShoppingListDetailContainer} /> */}
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
					name={AdminScreens.MANAGE_ACCOUNT}
					component={ManageAccountContainer}
					options={{headerShown:true}}
				/>
				<RootStack.Screen
					name={"MANAGE_FOOD"}
					component={ManageFoodContainer}
				/>
				<RootStack.Screen
					name={AdminScreens.MANAGE_UNIT}
					component={ManageUnitContainer}
					options={{headerShown:true}}
				/>

				<RootStack.Screen
					name="SHOPPING_LIST_BY_ID"
					component={ShoppingListByIdContainer} />
				<RootStack.Screen
					name="MENU_CALENDAR"
					component={MenuCalendarContainer} />
			</RootStack.Navigator>
		</NavigationContainer>
	);
};

export { ApplicationNavigator };
