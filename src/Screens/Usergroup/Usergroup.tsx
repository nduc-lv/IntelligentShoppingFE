import { ArrowLeft, ChevronRight, Plus, UserRoundPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { useLazyGetAllUserGroupQuery } from "@/Services/usergroup";

type GroupRouteParams = {
    Usergroup: { groupId: string, isAdmin: boolean, groupName: string };
};

export const UsergroupScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "Usergroup">>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { groupId, isAdmin, groupName } = route.params;

    const [fetchUserGroupList, { data: users = [], isLoading: isLoading, isError: isError }] = useLazyGetAllUserGroupQuery();
    const [pagination, setPagination] = useState({ page: 1, per: 10 });

    useEffect(() => {
        fetchUserGroupList({ groupId, ...pagination });
    }, [groupId, pagination, fetchUserGroupList]);

    if (users.length > 0) console.log(users);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("GROUP_INFO", { groupId: groupId, isAdmin: isAdmin })}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{"Members"}</Text>
                <TouchableOpacity onPress={() => console.log(1)}>
                    <UserRoundPlus size={24} color="#000" />
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
            ) : isError ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Failed to load shopping lists.</Text>
                </View>
            ) : users.length > 0 ? (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.user_id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => console.log(item.user_id)}>
                            <View style={styles.groupItem}>
                                <View style={styles.leftContent}>
                                    <Image
                                        defaultSource={{ uri: "https://via.placeholder.com/150" }}
                                        style={styles.groupImage}
                                    />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.userName}>{item.user.name}</Text>
                                        <Text style={styles.userRole}>
                                            {item.is_admin ? "Admin" : "Member"}
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight size={24} color="#888" />
                            </View>
                        </TouchableOpacity>
                    )}
                    // onEndReached={() =>
                    //   setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                    // }
                    onEndReachedThreshold={0.5}
                />
            ) : (
                <Text>No groups found.</Text>
            )}
            <TouchableOpacity style={styles.fab} onPress={() => console.log("Add button pressed!")}>
                <Plus color="white" size={25} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
    title: {
        flex: 1,
        marginLeft: 8,
        fontSize: 20,
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 16
    },
    groupItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red" },
    modalButtons: { flexDirection: "row", justifyContent: "space-between", margin: 16 },
    itemsContainer: { maxHeight: 400 }, // You can adjust the height based on your needs
    itemRow: { marginBottom: 12 }, // Add margin for spacing between items
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: '#007AFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    groupImage: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginLeft: 8,
        marginRight: 8,
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        flexDirection: "column",
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    userRole: {
        fontSize: 14,
        color: "#666",
    },
});