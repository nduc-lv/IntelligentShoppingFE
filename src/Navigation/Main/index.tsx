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
import { RootStackParamList } from "..";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import { userApi } from "@/Services";

const Tab = createBottomTabNavigator();

// @refresh reset
export const MainNavigator = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [getMe] = userApi.useLazyGetMeQuery();
  const accessToken = useSelector(
    (state: { auth: AuthState }) => state.auth.accessToken
  );
  useEffect(() => {
    var resp: any;
    const fetchMe = async () => {
      try {
        resp = await getMe();
      }
      catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (resp.data.user_role.role.name === 'admin') {
          navigation.navigate(RootScreens.ADMIN);
        }
      }
    }
    if (accessToken) {
      fetchMe();
    }
  }, [accessToken]);

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
        component={RecipeContainer}
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
