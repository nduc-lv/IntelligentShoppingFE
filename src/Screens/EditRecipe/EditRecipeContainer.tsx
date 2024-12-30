import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { EditRecipeScreen } from "./EditRecipe";
import { KeyboardAvoidingView, Platform, Text } from "react-native";


export const EditRecipeContainer = ({ route }: NativeStackScreenProps<RootStackParamList, "EDIT_RECIPE">) => {
    return <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
    >
        <EditRecipeScreen route={route} />
    </KeyboardAvoidingView>
};
