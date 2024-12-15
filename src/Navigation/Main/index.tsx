import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeContainer } from "@/Screens/Home";
import { GroupContainer } from "@/Screens/Group";
import { Home, User, Users } from "lucide-react-native"; // Import các icon từ Lucide
import { ShoppingListContainer } from "@/Screens/ShoppingList/ShoppinglistContainer";

const Tab = createBottomTabNavigator();

// @refresh reset
export const MainNavigator = () => {

  return (
    <Tab.Navigator>
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
        name="User"
        component={HomeContainer}
        options={{
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
