import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useLazyGetAllUserGroupQuery } from "@/Services/usergroup";
import { ArrowLeft, Info } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";

type GroupRouteParams = {
    GroupDetail: { groupId: string, groupName: string, isAdmin: boolean };
};

export const GroupInfoScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "GroupDetail">>();
    const [name, setName] = useState('');
    const { groupId, groupName, isAdmin } = route.params;

    const [fetchUserGroupList, { data: rows = [], isLoading, isError }] = useLazyGetAllUserGroupQuery();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [pagination, setPagination] = useState({ page: 1, per: 10 });

    useEffect(() => {
        fetchUserGroupList({ groupId, ...pagination });
        setName(groupName);
    }, [groupId, pagination, fetchUserGroupList]);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("GROUP_DETAIL", { groupId: groupId, groupName: groupName, isAdmin: isAdmin })}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{name}</Text>
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