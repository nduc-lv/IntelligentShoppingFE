import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeContainer } from "@/Screens/Home";
import { UserTabNavigation } from "./UserTab";
import { GroupContainer } from "@/Screens/Group";
import { Heart, Home, User, Users } from "lucide-react-native"; // Import các icon từ Lucide
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";
import { UserTabContainer } from "@/Screens/UserTab/UserTabContainer";
import { RecipeContainer } from "@/Screens/Recipe/RecipeContainer";
import { RootScreens } from "@/Screens";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import { userApi } from "@/Services";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecipeListContainer } from "@/Screens/RecipeList/RecipeListCointainer";
import { GroupDetailContainer } from "@/Screens/GroupDetail";
import { GroupInfoContainer } from "@/Screens/GroupInfo";
import { UsergroupContainer } from "@/Screens/Usergroup";
import { RootStack, RootStackParamList } from "..";
import { ShoppingListDetailContainer } from "@/Screens/ShoppingListDetail/ShoppingListDetailContainer";
import { RecipeDetailContainer } from "@/Screens/RecipeDetail/RecipeDetailContainer";
import { EditRecipeContainer } from "@/Screens/EditRecipe/EditRecipeContainer";
import { RecipeTabNavigation } from "./Recipe";

const Tab = createBottomTabNavigator();

// @refresh reset
export const MainNavigator = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [getMe,getMeState] = userApi.useLazyGetMeQuery();
	const accessToken = useSelector(
		(state: { auth: AuthState }) => state.auth.accessToken
	);
	useEffect(()=>{
		if(getMeState?.data?.user_role?.role?.name=== "admin"){
			navigation.navigate(RootScreens.ADMIN);
		}
	},[getMeState.data])
	return (
		<Tab.Navigator screenOptions={{ popToTopOnBlur: true, headerShown: false }}>
			{/* <Tab.Screen
				name="Home"
				component={HomeContainer}
				options={{
					tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
				}}
			/> */}
			<Tab.Screen
				name="Recipe"
				component={RecipeTabNavigation}
				options={{
					tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
				}}
			/>
			<Tab.Screen
				name="User"
				component={UserTabNavigation}
				options={{
					tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
				}}
			/>
			<Tab.Screen
				name="Group"
				component={GroupContainer}
				options={{
					tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
					headerLeft: ()=> null,
					headerShown:true
				}}
			/>
			<Tab.Screen
				name="Shopping List"
				component={ShoppingListContainer}
				options={{
					tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
				}}
			/>
		</Tab.Navigator>
	);
};
