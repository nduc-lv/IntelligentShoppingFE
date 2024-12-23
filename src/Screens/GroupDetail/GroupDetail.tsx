import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, TextInput } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, Info } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { useLazyGetGroupInfoQuery } from "@/Services/group";

type GroupRouteParams = {
    GroupDetail: { groupId: string, isAdmin: boolean };
};

export const GroupDetailScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "GroupDetail">>();
    const { groupId, isAdmin } = route.params;
    const [fetchGroupInfo, { data, isLoading, isError }] = useLazyGetGroupInfoQuery();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        fetchGroupInfo({ groupId });
    }, [groupId, fetchGroupInfo]);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
            ) : isError ? (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootScreens.MAIN)}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load shopping lists.</Text>
                    </View>
                </View>
            ) : data ? (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootScreens.MAIN)}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <Image
                        // source={{
                        //     uri: data.link_avatar,
                        // }}
                        defaultSource={{ uri: "https://via.placeholder.com/150" }}
                        style={styles.groupImage}
                    />
                    <Text style={styles.title}>{data.rows[0].group.name ?? "Unknown"}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("GROUP_INFO", { groupId: groupId, isAdmin: isAdmin })}>
                        <Info size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            ) : (
                <Text>No info found.</Text>
            )}
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
    groupImage: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginLeft: 8,
        marginRight: 8,
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red" },
});