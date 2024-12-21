import React, { useEffect } from "react";
import { SignInAndRegister } from "./SignIn";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import { CommonActions } from "@react-navigation/native";

type SignInScreenNavigatorProps = NativeStackScreenProps<
	RootStackParamList,
	RootScreens.SIGN_IN
>;

export const SignInContainer = ({ navigation }: SignInScreenNavigatorProps) => {
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
		if (accessToken) {
			onNavigate(RootScreens.MAIN);
		}
	}, [accessToken]);
	return <SignInAndRegister onNavigate={onNavigate} />;
};
