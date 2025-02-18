import { ArrowLeft, EllipsisVertical, Plus, UserRoundPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, Button, TextInput } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { useCreateUserGroupMutation, useDeleteUserGroupMutation, useLazyGetAllUserGroupQuery, useUpdateUserGroupMutation } from "@/Services/usergroup";
import { Menu, Provider } from "react-native-paper";
import { useLazyGetUserByEmailQuery, useLazyGetUserByUsernameQuery } from "@/Services";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import { useToast } from "react-native-toast-notifications";
import { Actionsheet, Input } from "native-base";
import AppData from "@/General/Constants/AppData";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";
import AppConfig from "@/General/Constants/AppConfig";

type GroupRouteParams = {
    Usergroup: { groupId: string, isAdmin: boolean, groupName: string };
};

interface ApiError {
    status: number;
    data: any;
}

export const UsergroupScreen = () => {
    const bottomInset=useKeyboardBottomInset()
    const route = useRoute<RouteProp<GroupRouteParams, "Usergroup">>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { groupId, isAdmin, groupName } = route.params;

    const [fetchUserGroupList, { data: users = [], isLoading: isListLoading, isError: isListError }] = useLazyGetAllUserGroupQuery();
    const myInfo = useSelector((state: { auth: AuthState }) => (state.auth.user))

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
    const toast = useToast();

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
                toast.show("Xóa thành viên thành công", { placement: "top", type: "success" });
                fetchUserGroupList({ groupId, ...pagination });
            }
            else {
                toast.show("Bạn không phải trưởng nhóm", { placement: "top", type: "warning" });
            }
        } catch (e) {
            console.log(e)
            toast.show("Xóa thất bại", { placement: "top", type: "warning" });
        }
    }

    const handleEditMember = async (option: string) => {
        try {
            if (isAdmin) {
                const payload = {
                    is_admin: option === 'promote' ? 1 : 0
                };
                await updateUsergroup({ group_id: groupId, user_id: selectedUser, ...payload });
                toast.show("Cập nhật thành công", { placement: "top", type: "success" });
                fetchUserGroupList({ groupId, ...pagination });
            }
            else {
                toast.show("Bạn không phải trưởng nhóm", { placement: "top", type: "warning" });
            }
        } catch (e) {
            console.log(e)
            toast.show("Cập nhật thất bại", { placement: "top", type: "warning" });
        }
    }

    const handleCreateMember = async () => {
        if (!memberUsername.trim()) {
            toast.show("Chưa điền tên thành viên", { placement: "top", type: "warning" });
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
                toast.show("Không tìm được người dùng", { placement: "top", type: "warning" });
                return;
            }
            setErrorMessage('');
            const payload = {
                group_id: groupId,
                user_id: foundUser.dataValues.id,
                is_admin: false
            }

            const response = await createUsergroup(payload).unwrap();
            toast.show("Thêm thành viên thành công", { placement: "top", type: "success" });
            handleCloseCreateDialog();
            fetchUserGroupList({ groupId, ...pagination });
        } catch (error) {
            console.error("Unexpected error:", error);
            setErrorMessage((error as ApiError).data.message);
            toast.show("Thêm thành viên thất bại", { placement: "top", type: "warning" });
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
                                        defaultSource={{ uri: AppConfig.defaultAvatar}}
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
                {createModalVisible && (
                    <Actionsheet isOpen={createModalVisible}
                        onClose={() => handleCloseCreateDialog()}
                        hideDragIndicator
                    >
                        <Actionsheet.Content borderTopRadius={24} bottom={bottomInset}>
                            <View
                                style={{
                                    height: "auto",
                                    padding: 24,
                                    gap: 16,
                                    width: "100%",
                                }}>
                                <View style={{ width: "100%", zIndex: 3, flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                    <Input
                                        width={"100%"}
                                        placeholder="Username/Email"
                                        size={"xl"}
                                        height={12}
                                        bgColor="white"
                                        borderRadius={10}
                                        borderColor={AppData.colors.text[400]}
                                        borderWidth={0.3}
                                        _focus={{
                                            borderColor: AppData.colors.primary,
                                            backgroundColor: "white",
                                        }}
                                        value={memberUsername}
                                        onChangeText={setMemberUsername}
                                    />
                                    {errorMessage ? (
                                        <Text style={styles.errorText}>{errorMessage}</Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity style={{
                                    padding: 16,
                                    height: 60,
                                    alignSelf: 'center',
                                    backgroundColor: AppData.colors.primary,
                                    borderRadius: 16,
                                    alignItems: 'center',
                                    zIndex: 1,
                                    minWidth: 200
                                }}
                                    onPress={() => handleCreateMember()}
                                >
                                    <Text style={{
                                        fontSize: AppData.fontSizes.medium,
                                        fontWeight: "500",
                                        color: AppData.colors.text[100],
                                    }}>
                                        {'Thêm thành viên'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Actionsheet.Content>
                    </Actionsheet>
                )}
                {/* <Modal
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
                </Modal> */}
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