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
import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native";
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
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ShoppingListByIdContainer } from "@/Screens/ShoppingListById/ShoppingListByIdContainer";
import { ShoppingListTabNavigation } from "./ShoppingList";
const Tab = createBottomTabNavigator();

const RecipeStack = () => (
	<RootStack.Navigator>
		<RootStack.Screen
			name="RECIPE"
			component={RecipeContainer}
			options={() => ({
				headerTitle: `Danh sách món ăn`,
				headerLeft: ()=> null,
			})}
		/>
		<RootStack.Screen
			name="RECIPE_LIST"
			component={RecipeListContainer}
			options={() => ({
				headerTitle: `Món ngon hàng ngày`,
			})}
		/>
		<RootStack.Screen
			name="RECIPE_DETAIL"
			component={RecipeDetailContainer}
			options={({ route }) => ({
				headerShown: false
			})}
		/>
		<RootStack.Screen
			name="EDIT_RECIPE"
			component={EditRecipeContainer}
			options={({ route }) => ({
				headerShown: false
			})}
		/>
	</RootStack.Navigator>
);

// @refresh reset
export const MainNavigator = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const user=useSelector((state:{auth:AuthState})=>(state.auth.user))
	useEffect(()=>{
		if(user?.user_role?.role_id === "admin"){
			navigation.dispatch(
				CommonActions.reset({
				  index: 0,
				  routes: [{ name: RootScreens.ADMIN }],
				})
			  );
		}
	},[user])
	return (
		<Tab.Navigator screenOptions={{ popToTopOnBlur: true, headerShown: false }}>
			<Tab.Screen
				name="Group"
				component={GroupContainer}
				options={{
					tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
					headerLeft: () => null,
					headerShown: true
				}}
			/>
			<Tab.Screen
				name="Recipe"
				component={RecipeStack}
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
				name="Shopping List"
				component={ShoppingListTabNavigation}
				options={{
					tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
					tabBarLabelPosition: "below-icon",
					
				}}
			/>
		</Tab.Navigator>
	);
};
