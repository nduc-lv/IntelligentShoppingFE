import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecipeContainer } from "@/Screens/Recipe/RecipeContainer";
import { RecipeListContainer } from "@/Screens/RecipeList/RecipeListCointainer";
import { RecipeDetailContainer } from "@/Screens/RecipeDetail/RecipeDetailContainer";
import { EditRecipeContainer } from "@/Screens/EditRecipe/EditRecipeContainer";

export type UserTabStackParamList = {
	RECIPE: undefined;
	RECIPE_DETAIL: { recipeId: string };
	RECIPE_LIST: undefined;
	EDIT_RECIPE: { recipeId: string };
};
const RecipeTabStack = createNativeStackNavigator<UserTabStackParamList>();

// @refresh reset
export const RecipeTabNavigation = () => (
	<RecipeTabStack.Navigator>
		<RecipeTabStack.Screen
			name={"RECIPE"}
			component={RecipeContainer}
			options={() => ({
				headerTitle: `Danh sách món ăn`,
				headerLeft: ()=> null,
			})}
		/>
		<RecipeTabStack.Screen
			name="RECIPE_LIST"
			component={RecipeListContainer}
			options={() => ({
				headerTitle: `Món ngon hàng ngày`,
			})}
		/>
		<RecipeTabStack.Screen
			name="RECIPE_DETAIL"
			component={RecipeDetailContainer}
			options={({ route }) => ({
				headerShown: false,
			})}
		/>
		<RecipeTabStack.Screen
			name="EDIT_RECIPE"
			component={EditRecipeContainer}
			options={({ route }) => ({
				headerShown: false,
			})}
		/>
	</RecipeTabStack.Navigator>
);