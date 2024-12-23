import React, { useEffect } from "react";
import { SignInAndRegister } from "./SignIn";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import { CommonActions } from "@react-navigation/native";
import { userApi } from "@/Services";

type SignInScreenNavigatorProps = NativeStackScreenProps<
	RootStackParamList,
	RootScreens.SIGN_IN
>;

export const SignInContainer = ({ navigation }: SignInScreenNavigatorProps) => {
	const [getMe] = userApi.useLazyGetMeQuery();
	const onNavigate = (screen: RootScreens) => {
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: screen }],
			})
		);
	};
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
				if(resp.data.user_role.role.name === 'admin'){
					onNavigate(RootScreens.ADMIN);
				}
				else onNavigate(RootScreens.MAIN);
			}
		}
		if (accessToken) {
			fetchMe();
		}
	}, [accessToken]);
	return <SignInAndRegister onNavigate={onNavigate} />;
};
