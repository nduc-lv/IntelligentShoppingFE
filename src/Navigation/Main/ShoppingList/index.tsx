import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";
import { ShoppingListDetailContainer } from "@/Screens/ShoppingListDetail/ShoppingListDetailContainer";
import { ShoppingListByIdContainer } from "@/Screens/ShoppingListById/ShoppingListByIdContainer";



const ShoppingListTab = createNativeStackNavigator<RootStackParamList>();

// @refresh reset
export const ShoppingListTabNavigation = () => {
	return (
		<ShoppingListTab.Navigator>
			<ShoppingListTab.Screen
				name="SHOPPING_LIST"
				component={ShoppingListContainer}
				options={() => ({
					headerTitle: `Shopping List`,
					headerLeft: () => null,
				})}
			/>
			<ShoppingListTab.Screen
				name="SHOPPING_LIST_DETAIL"
				component={ShoppingListDetailContainer}
				options={() => ({
					headerTitle: `Shopiing List By Group`,
				})}
			/>
			<ShoppingListTab.Screen
				name="SHOPPING_LIST_BY_ID"
				component={ShoppingListByIdContainer}
				options={({ route }) => ({
					headerTitle: `Shopping List Detail`,
					headerShown: false,
				})}
			/>
		</ShoppingListTab.Navigator>
	)
};