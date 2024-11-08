import React from "react";
import { SignIn } from "./SignIn";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";

type SignInScreenNavigatorProps = NativeStackScreenProps<
    RootStackParamList,
    RootScreens.SIGN_IN
>;

export const SignInContainer = ({
    navigation,
}: SignInScreenNavigatorProps) => {
    const onNavigate = (screen: RootScreens) => {
        navigation.navigate(screen);
    };

    return <SignIn onNavigate={onNavigate} />;
};
