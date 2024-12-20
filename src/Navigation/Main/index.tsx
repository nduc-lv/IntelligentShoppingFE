import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeContainer } from "@/Screens/Home";
import { UserTabNavigation } from "./UserTab";
import { GroupContainer } from "@/Screens/Group";
import { Heart, Home, User, Users } from "lucide-react-native"; // Import các icon từ Lucide
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";
import { UserTabContainer } from "@/Screens/UserTab/UserTabContainer";
import { RecipeContainer } from "@/Screens/Recipe/RecipeContainer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecipeListContainer } from "@/Screens/RecipeList/RecipeListCointainer";
import { GroupDetailContainer } from "@/Screens/GroupDetail";
import { GroupInfoContainer } from "@/Screens/GroupInfo";
import { UsergroupContainer } from "@/Screens/Usergroup";
import { RootStack, RootStackParamList } from "..";
import { ShoppingListDetailContainer } from "@/Screens/ShoppingListDetail/ShoppingListDetailContainer";
import { RecipeDetailContainer } from "@/Screens/RecipeDetail/RecipeDetailContainer";
import { EditRecipeContainer } from "@/Screens/EditRecipe/EditRecipeContainer";


const Tab = createBottomTabNavigator();

const GroupStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="GROUP_DETAIL"
      component={GroupDetailContainer}
      options={() => ({
        headerTitle: `Danh sách món ăn`,
      })}
    />
    <RootStack.Screen
      name="GROUP_INFO"
      component={GroupInfoContainer}
      options={() => ({
        headerTitle: `Món ngon hàng ngày`,
      })}
    />
    <RootStack.Screen
      name="GROUP"
      component={GroupContainer}
      options={() => ({
        headerTitle: `Danh sách món ăn`,
      })}
    />
    <RootStack.Screen
      name="USERGROUP"
      component={UsergroupContainer}
      options={() => ({
        headerTitle: `Món ngon hàng ngày`,
      })}
    />
  </RootStack.Navigator>
);

const ShoppingListStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name={'SHOPPING_LIST'}
      component={ShoppingListContainer}
      options={() => ({
        headerTitle: `Danh sách món ăn`,
      })}
    />
    <RootStack.Screen
      name="SHOPPING_LIST_DETAIL"
      component={ShoppingListDetailContainer}
      options={() => ({
        headerTitle: `Món ngon hàng ngày`,
      })}
    />
  </RootStack.Navigator>
);

const RecipeStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="RECIPE"
      component={RecipeContainer}
      options={() => ({
        headerTitle: `Danh sách món ăn`,
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
  return (
    <Tab.Navigator screenOptions={{ popToTopOnBlur: true, headerShown: false }}
    >
      <Tab.Screen
        name="Group"
        component={GroupContainer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tab.Screen
        name="Recipe"
        component={RecipeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tab.Screen
        name="User"
        component={UserTabNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tab.Screen
        name="Shopping List"
        component={ShoppingListContainer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
    </Tab.Navigator>
  );
};
