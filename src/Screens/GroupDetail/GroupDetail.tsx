import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, Info } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";

type GroupRouteParams = {
    GroupDetail: { groupId: string, groupName: string, isAdmin: boolean };
};

export const GroupDetailScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "GroupDetail">>();
    const { groupId, groupName, isAdmin } = route.params;

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate(RootScreens.MAIN)}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{groupName}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("GROUP_INFO", { groupId: groupId, groupName: groupName, isAdmin: isAdmin })}>
                    <Info size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    title: {
        flex: 1,
        marginLeft: 8,
        fontSize: 20,
        fontWeight: "bold",
    },
});