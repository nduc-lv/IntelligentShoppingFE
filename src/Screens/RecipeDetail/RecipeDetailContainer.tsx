import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { RecipeDetailScreen } from "./RecipeDetail";
import { Text } from "react-native";


export const RecipeDetailContainer = ({ route }: NativeStackScreenProps<RootStackParamList, "RECIPE_DETAIL">) => {
    return <RecipeDetailScreen route={route} />
};
