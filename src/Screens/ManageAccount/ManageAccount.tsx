import { RootStackParamList } from "@/Navigation";
import { useBanUserMutation, useDeleteUserMutation, useLazyGetAllUserroleQuery, UserRoleResponse, useUnbanUserMutation } from "@/Services/userrole";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";
import { RootScreens } from "..";
import { ArrowLeft } from "lucide-react-native";
import {
    Toast,
} from "antd-mobile";

export const ManageAccountScreen = () => {
    const [fetchUserrole, { data, isLoading, isError }] = useLazyGetAllUserroleQuery();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserRoleResponse>();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [banUser] = useBanUserMutation();
    const [unbanUser] = useUnbanUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    var filteredUsers: UserRoleResponse[] = [];

    const handleSearch = (text: any) => {
        setSearchQuery(text);
    };

    const handleUserPress = (user: UserRoleResponse) => {
        setSelectedUser(user);
        setDialogVisible(true);
    };

    const handleCloseDialog = () => {
        setDialogVisible(false);
    };

    const handleBanUnban = async () => {
        try {
            if (selectedUser) {
                if(selectedUser.is_active) await banUser({ id: selectedUser.id }).unwrap();
                else await unbanUser({ id: selectedUser.id }).unwrap();
                Toast.show({ content: "User banned successfully!", icon: "success" });
                fetchUserrole();
                handleCloseDialog();
            }
            else{
                Toast.show({ content: "User not found!", icon: "fail" });
            }
        }
        catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to ban user.", icon: "fail" });
        }
    };

    const handleChangePassword = () => {
        if (selectedUser) console.log('Change password for', selectedUser.email);
    };

    const handleDeleteAccount = async () => {
        try {
            if (selectedUser) {
                await deleteUser({ id: selectedUser.id }).unwrap();
                Toast.show({ content: "User deleted successfully!", icon: "success" });
                fetchUserrole();
                handleCloseDialog();
            }
            else{
                Toast.show({ content: "User not found!", icon: "fail" });
            }
        }
        catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to delete user.", icon: "fail" });
        }
    };

    useEffect(() => {
        fetchUserrole();
    }, [fetchUserrole]);

    if (data) {
        filteredUsers = data.filter(
            (data) =>
                data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const renderUserItem = (item: UserRoleResponse) => (
        <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
            <Image source={{ uri: item.link_avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Text style={[styles.userStatus, item.is_active ? styles.activeStatus : styles.bannedStatus]}>
                {item.is_active ? 'Active' : 'Banned'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
            ) : isError ? (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootScreens.ADMIN)}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load users.</Text>
                    </View>
                </View>
            ) : data ? (
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate(RootScreens.ADMIN)}>
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{"Quản lý tài khoản"}</Text>
                    </View>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search for account..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderUserItem(item)}
                        contentContainerStyle={styles.listContainer}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={dialogVisible}
                        onRequestClose={handleCloseDialog}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                {selectedUser && (
                                    <>
                                        <Image source={{ uri: selectedUser.link_avatar }} style={styles.dialogAvatar} />
                                        <Text style={styles.dialogTitle}>{selectedUser.name}</Text>
                                        <Text style={styles.dialogText}>Email: {selectedUser.email}</Text>
                                        <Text style={styles.dialogText}>Username: {selectedUser.username}</Text>
                                        <Text style={styles.dialogText}>
                                            Created At: {new Date(selectedUser.created_at).toLocaleDateString()}
                                        </Text>

                                        <View style={styles.dialogButtons}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.dialogButton,
                                                    { backgroundColor: selectedUser.is_active ? 'red' : 'green' },
                                                ]}
                                                onPress={handleBanUnban}
                                            >
                                                <Text style={styles.dialogButtonText}>
                                                    {selectedUser.is_active ? 'Ban' : 'Unban'}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.dialogButton, { backgroundColor: 'red' }]}
                                                onPress={handleChangePassword}
                                            >
                                                <Text style={styles.dialogButtonText}>Change Password</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.dialogButton, { backgroundColor: 'red' }]}
                                                onPress={handleDeleteAccount}
                                            >
                                                <Text style={styles.dialogButtonText}>Delete Account</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.dialogButton]}
                                                onPress={handleCloseDialog}
                                            >
                                                <Text style={styles.dialogButtonText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>


                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                </View>
            ) : (
                <Text>No info found.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    title: {
        flex: 1,
        marginLeft: 8,
        fontSize: 20,
        fontWeight: "bold",
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
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 16
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    errorText: { color: "red" },
    searchBar: {
        margin: 16,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#fff',
        marginVertical: 8,
        borderRadius: 8,
    },
    listContainer: {
        padding: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    userStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        textAlign: 'center',
    },
    activeStatus: {
        color: 'green',
    },
    bannedStatus: {
        color: 'red',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    dialogAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dialogText: {
        fontSize: 16,
        marginBottom: 4,
    },
    dialogButtons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    dialogButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignSelf: 'center',
        margin: 4,
    },
    dialogButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});