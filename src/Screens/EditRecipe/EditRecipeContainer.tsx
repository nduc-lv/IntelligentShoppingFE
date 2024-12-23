import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { EditRecipeScreen } from "./EditRecipe";
import { Text } from "react-native";


export const EditRecipeContainer = ({ route }: NativeStackScreenProps<RootStackParamList, "EDIT_RECIPE">) => {
    return <EditRecipeScreen route={route} />
};
