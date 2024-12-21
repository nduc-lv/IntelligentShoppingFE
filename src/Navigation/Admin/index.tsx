import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ManageContainer } from "@/Screens/Manage";
import { Bolt, Heart, Home, User, Users } from "lucide-react-native"; // Import các icon từ Lucide
import { RootScreens } from "@/Screens";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "..";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import { userApi } from "@/Services";
import { UserTabNavigation } from "../Main/UserTab";

const Tab = createBottomTabNavigator();

// @refresh reset
export const AdminNavigator = () => {
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
        if (resp.data.user_role.role.name != 'admin') {
          navigation.navigate(RootScreens.MAIN);
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
        name="Manage"
        component={ManageContainer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Bolt color={color} size={size} />
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
    </Tab.Navigator>
  );
};