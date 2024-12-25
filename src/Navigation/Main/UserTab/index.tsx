import React from "react";
import { UserTabContainer } from "@/Screens/UserTab";
import { AccountSettingsContainer } from "@/Screens/AccountSettings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserTabScreens } from "@/Screens";

export type UserTabStackParamList = {
	[UserTabScreens.ACCOUNT_SETTING]: undefined;
	[UserTabScreens.USER_TAB_MAIN]: undefined;
};
const UserTabStack = createNativeStackNavigator<UserTabStackParamList>();

// @refresh reset
export const UserTabNavigation = () => {
	return (
		<UserTabStack.Navigator initialRouteName={UserTabScreens.USER_TAB_MAIN}>
			<UserTabStack.Screen
				name={UserTabScreens.USER_TAB_MAIN}
				component={UserTabContainer}
				options={{
					headerLeft: ()=> null,
				}}
			/>
			<UserTabStack.Screen
				name={UserTabScreens.ACCOUNT_SETTING}
				component={AccountSettingsContainer}
				options={{}}
			/>
		</UserTabStack.Navigator>
	);
};
