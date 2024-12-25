import { ArrowLeft, EllipsisVertical, Plus, UserRoundPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, Button, TextInput } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { useCreateUserGroupMutation, useDeleteUserGroupMutation, useLazyGetAllUserGroupQuery, useUpdateUserGroupMutation } from "@/Services/usergroup";
import { Menu, Provider } from "react-native-paper";
import {
    Toast,
} from "antd-mobile";
import { useLazyGetMeQuery, useLazyGetUserByEmailQuery, useLazyGetUserByUsernameQuery } from "@/Services";

type GroupRouteParams = {
    Usergroup: { groupId: string, isAdmin: boolean, groupName: string };
};

interface ApiError {
    status: number;
    data: any;
}

export const UsergroupScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "Usergroup">>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { groupId, isAdmin, groupName } = route.params;

    const [fetchUserGroupList, { data: users = [], isLoading: isListLoading, isError: isListError }] = useLazyGetAllUserGroupQuery();
    const [getMe, { data: myInfo }] = useLazyGetMeQuery();
    const [triggerEmailSearch] = useLazyGetUserByEmailQuery();
    const [triggerUsernameSearch] = useLazyGetUserByUsernameQuery();
    const [deleteUsergroup] = useDeleteUserGroupMutation();
    const [updateUsergroup] = useUpdateUserGroupMutation();
    const [createUsergroup] = useCreateUserGroupMutation();
    const [pagination, setPagination] = useState({ page: 1, per: 10 });
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [memberUsername, setMemberUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const openMenu = (user_id: string) => {
        setSelectedUser(user_id);
        setVisible(true);
    }
    const closeMenu = () => {
        setSelectedUser('');
        setVisible(false);
    }

    const handleOpenCreateDialog = () => {
        if (isAdmin) setCreateModalVisible(true);
    };

    const handleCloseCreateDialog = () => {
        setCreateModalVisible(false);
        setMemberUsername('');
    };

    const handleRemoveMember = async () => {
        try {
            if (isAdmin) {
                await deleteUsergroup({ group_id: groupId, user_id: selectedUser });
                Toast.show({ content: "Member removed successfully!", icon: "success" });
                fetchUserGroupList({ groupId, ...pagination });
            }
            else {
                Toast.show({ content: "You are not group admin!", icon: "fail" });
            }
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to delete member.", icon: "fail" });
        }
    }

    const handleEditMember = async (option: string) => {
        try {
            if (isAdmin) {
                const payload = {
                    is_admin: option === 'promote' ? 1 : 0
                };
                await updateUsergroup({ group_id: groupId, user_id: selectedUser, ...payload });
                Toast.show({ content: "Member updated successfully!", icon: "success" });
                fetchUserGroupList({ groupId, ...pagination });
            }
            else {
                Toast.show({ content: "You are not group admin!", icon: "fail" });
            }
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to update member.", icon: "fail" });
        }
    }

    const handleCreateMember = async () => {
        if (!memberUsername.trim()) {
            Toast.show({ content: "Please enter member's username or email!", icon: "fail" });
            return;
        }
        try {
            const emailResponse = await triggerEmailSearch(memberUsername.trim());
            const usernameResponse = await triggerUsernameSearch(memberUsername.trim());

            const emailResult = emailResponse?.data;
            const usernameResult = usernameResponse?.data;

            if (!emailResult && !usernameResult) {
                throw {
                    data: {
                        message: 'User not found!',
                    },
                    status: 404,
                };
            }

            const foundUser = (emailResult ? emailResult : (usernameResult ? usernameResult : undefined));

            if (!foundUser) {
                Toast.show({ content: "No matching user found.", icon: "fail" });
                return;
            }
            setErrorMessage('');
            const payload = {
                group_id: groupId,
                user_id: foundUser.dataValues.id,
                is_admin: false
            }

            const response = await createUsergroup(payload).unwrap();
            Toast.show({ content: "Member found and created successfully!", icon: "success" });
            handleCloseCreateDialog();
            fetchUserGroupList({ groupId, ...pagination });
        } catch (error) {
            console.error("Unexpected error:", error);
            setErrorMessage((error as ApiError).data.message);
            Toast.show({ content: "Failed to create member.", icon: "fail" });
        }
    }

    useEffect(() => {
        fetchUserGroupList({ groupId, ...pagination });
    }, [groupId, pagination, fetchUserGroupList]);

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("GROUP_INFO", { groupId: groupId, isAdmin: isAdmin })}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{"Members"}</Text>
                    {isAdmin && (
                        <TouchableOpacity onPress={() => handleOpenCreateDialog()}>
                            <UserRoundPlus size={24} color="#000" />
                        </TouchableOpacity>
                    )}
                </View>
                {isListLoading ? (
                    <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
                ) : isListError ? (
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load user lists.</Text>
                    </View>
                ) : users.length > 0 ? (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.user_id}
                        renderItem={({ item }) => (
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
                                {(isAdmin && item.user_id != myInfo?.id) && (
                                    <Menu
                                        visible={visible && (selectedUser == item.user_id)}
                                        onDismiss={closeMenu}
                                        anchor={
                                            <EllipsisVertical
                                                size={24}
                                                color="#888"
                                                onPress={() => openMenu(item.user_id)}
                                            />
                                        }
                                        contentStyle={styles.menuContent}
                                    >
                                        {!item.is_admin && (
                                            <Menu.Item
                                                onPress={() => handleEditMember("promote")}
                                                title="Promote to Admin"
                                                titleStyle={styles.menuItemText}
                                            />
                                        )}
                                        {item.is_admin && (
                                            <Menu.Item
                                                onPress={() => handleEditMember("demote")}
                                                title="Demote to Member"
                                                titleStyle={styles.menuItemText}
                                            />
                                        )}
                                        {!item.is_admin && (
                                            <Menu.Item
                                                onPress={() => handleRemoveMember()}
                                                title="Remove Member"
                                                titleStyle={[styles.menuItemText, styles.dangerText]}
                                            />
                                        )}
                                    </Menu>
                                )}
                            </View>
                        )}
                        // onEndReached={() =>
                        //   setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                        // }
                        onEndReachedThreshold={0.5}
                    />
                ) : (
                    <Text>No groups found.</Text>
                )}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={createModalVisible}
                    onRequestClose={() => handleCloseCreateDialog()}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Enter Member Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Username/Email"
                                value={memberUsername}
                                onChangeText={setMemberUsername}
                            />
                            {errorMessage ? (
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            ) : null}
                            <View style={styles.buttonContainer}>
                                <Button title="Cancel" onPress={() => handleCloseCreateDialog()} />
                                <Button title="Add" onPress={() => handleCreateMember()} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </Provider>
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
    errorText: { color: "red", marginBottom: 10 },
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
    menuContent: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        elevation: 2,
    },
    menuItemText: {
        fontSize: 16,
        color: "#333",
    },
    dangerText: {
        color: "red",
        fontWeight: "bold",
    },
    menuDivider: {
        backgroundColor: "#ddd",
        height: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
});