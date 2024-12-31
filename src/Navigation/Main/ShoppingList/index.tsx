import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";
import { ShoppingListDetailContainer } from "@/Screens/ShoppingListDetail/ShoppingListDetailContainer";
import { ShoppingListByIdContainer } from "@/Screens/ShoppingListById/ShoppingListByIdContainer";
import { i18n, LocalizationKey } from "@/Localization";



const ShoppingListTab = createNativeStackNavigator<RootStackParamList>();

// @refresh reset
export const ShoppingListTabNavigation = () => {
	return (
		<ShoppingListTab.Navigator>
			<ShoppingListTab.Screen
				name="SHOPPING_LIST"
				component={ShoppingListContainer}
				options={() => ({
					headerTitle: i18n.t(LocalizationKey.SHOPPING_LIST),
					headerLeft: () => null,
				})}
			/>
			<ShoppingListTab.Screen
				name="SHOPPING_LIST_DETAIL"
				component={ShoppingListDetailContainer}
				options={() => ({
					headerTitle: i18n.t(LocalizationKey.SHOPPING_LIST_BY_GROUP),
				})}
			/>
			<ShoppingListTab.Screen
				name="SHOPPING_LIST_BY_ID"
				component={ShoppingListByIdContainer}
				options={({ route }) => ({
					headerTitle: i18n.t(LocalizationKey.SHOPPING_LIST_DETAIL),
					headerShown: true,
				})}
			/>
		</ShoppingListTab.Navigator>
	)
};