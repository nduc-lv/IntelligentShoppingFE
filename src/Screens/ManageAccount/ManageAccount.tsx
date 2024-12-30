import { RootStackParamList } from "@/Navigation";
import { useBanUserMutation, useDeleteUserMutation, useLazyGetAllUserroleQuery, UserRoleResponse, useUnbanUserMutation } from "@/Services/userrole";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";
import { RootScreens } from "..";
import { ArrowLeft } from "lucide-react-native";
import { Actionsheet, Avatar, Input, ScrollView } from "native-base";
import AppData from "@/General/Constants/AppData";
import { useUpdateUserMutation } from "@/Services";
import { useToast } from "react-native-toast-notifications";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";

export const ManageAccountScreen = () => {
    const bottomInset=useKeyboardBottomInset()
    const [fetchUserrole, { data, isLoading, isError }] = useLazyGetAllUserroleQuery();
    const [updateUser] = useUpdateUserMutation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserRoleResponse>();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [banUser] = useBanUserMutation();
    const [unbanUser] = useUnbanUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const Toast = useToast();
    const [filteredUsers,setFilteredUsers]=useState<UserRoleResponse[]>([]);
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

    const handleOpenUpdateDialog = () => {
        setDialogVisible(false);
        setUpdateDialogVisible(true);
    }

    const handleCloseUpdateDialog = () => {
        setUpdateDialogVisible(false);
        setDialogVisible(true);
        setNewPassword('');
    }

    const handleBanUnban = async () => {
        try {
            if (selectedUser) {
                if (selectedUser.is_active) await banUser({ id: selectedUser.id }).unwrap();
                else await unbanUser({ id: selectedUser.id }).unwrap();
                Toast.show("Cấm người dùng thành công", { placement: "top", type: "success" });
                fetchUserrole();
            }
            else {
                Toast.show("Chưa chọn người dùng", { placement: "top", type: "warning" });
            }
            handleCloseDialog();
        }
        catch (e) {
            console.log(e)
            Toast.show("Cấm thất bại", { placement: "top", type: "warning" });
        }
    };

    const handleChangePassword = async () => {
        try{
            if (selectedUser){
                if(!newPassword){
                    Toast.show("Chưa điền mật khẩu mới", { placement: "top", type: "warning" });
                    return;
                }
                const payload = {
                    password: newPassword
                }
                await updateUser({id: selectedUser.id, ...payload}).unwrap();
                Toast.show("Đổi mật khẩu thành công", { placement: "top", type: "success" });
            }
            handleCloseUpdateDialog();
        }
        catch (e) {
            console.log(e)
            Toast.show("Đổi mật khẩu thất bại", { placement: "top", type: "warning" });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            if (selectedUser) {
                await deleteUser({ id: selectedUser.id }).unwrap();
                Toast.show("Xóa người dùng thành công", { placement: "top", type: "success" });
                fetchUserrole();
                handleCloseDialog();
            }
            else {
                Toast.show("Người dùng không hơp lệ", { placement: "top", type: "warning" });
            }
        }
        catch (e) {
            console.log(e)
            Toast.show("Xóa người dùng thất bại", { placement: "top", type: "warning" });
        }
    };

    useEffect(() => {
        fetchUserrole();
    }, [fetchUserrole]);
    useEffect(()=>{
        if(data){
            setFilteredUsers(
                data.filter(
                    (data) =>
                        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        data.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        data.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        } else{
            setFilteredUsers([]);
        }
        console.log(filteredUsers)
    },[data])

    const renderUserItem = (item: UserRoleResponse) => (
        <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
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
                <>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Tìm kiếm tài khoản..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => renderUserItem(item)}
                            scrollEnabled={true}
                            contentContainerStyle={styles.listContainer}
                        />
                    <Actionsheet isOpen={dialogVisible}
                        onClose={() => handleCloseDialog()}
                        hideDragIndicator

                    >
                        <Actionsheet.Content borderTopRadius={24}  bottom={bottomInset}               >
                            {selectedUser && (
                                <View style={{
                                    height: 500,
                                    padding: 24,
                                    gap: 16
                                }}>
                                    <View style={{ width: "100%", zIndex: 3, flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                        <Image source={{ uri: selectedUser.link_avatar }} style={styles.dialogAvatar} />
                                        <Text style={styles.dialogText}>Email: {selectedUser.email}</Text>
                                        <Text style={styles.dialogText}>Username: {selectedUser.username}</Text>
                                        <Text style={styles.dialogText}>
                                            Created At: {new Date(selectedUser.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        padding: 16,
                                        height: 60,
                                        alignSelf: 'center',
                                        backgroundColor: selectedUser.is_active ? AppData.colors.danger : AppData.colors.primary,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        zIndex: 1,
                                        minWidth: 200
                                    }}
                                        onPress={() => handleBanUnban()}
                                    >
                                        <Text style={{
                                            fontSize: AppData.fontSizes.medium,
                                            fontWeight: "500",
                                            color: AppData.colors.text[100],
                                        }}>
                                            {selectedUser.is_active ? 'Cấm' : 'Gỡ cấm'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        padding: 16,
                                        height: 60,
                                        alignSelf: 'center',
                                        backgroundColor: AppData.colors.danger,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        zIndex: 1,
                                        minWidth: 200
                                    }}
                                        onPress={() => handleOpenUpdateDialog()}
                                    >
                                        <Text style={{
                                            fontSize: AppData.fontSizes.medium,
                                            fontWeight: "500",
                                            color: AppData.colors.text[100],
                                        }}>
                                            {"Đổi mật khẩu"}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        padding: 16,
                                        height: 60,
                                        alignSelf: 'center',
                                        backgroundColor: AppData.colors.danger,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        zIndex: 1,
                                        minWidth: 200
                                    }}
                                        onPress={() => handleDeleteAccount()}
                                    >
                                        <Text style={{
                                            fontSize: AppData.fontSizes.medium,
                                            fontWeight: "500",
                                            color: AppData.colors.text[100],
                                        }}>
                                            {"Xóa tài khoản"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Actionsheet.Content>
                    </Actionsheet>
                    <Actionsheet isOpen={updateDialogVisible}
                        onClose={() => handleCloseUpdateDialog()}
                        hideDragIndicator
                    >
                        <Actionsheet.Content borderTopRadius={24}   bottom={bottomInset}             >
                            <View style={{
                                height: 200,
                                padding: 24,
                                gap: 16
                            }}>
                                <View style={{ width: "100%", zIndex: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                    <Input
                                        width={"100%"}
                                        placeholder="Mật khẩu mới"
                                        size={"xl"}
                                        height={12}
                                        bgColor="white"
                                        borderRadius={10}
                                        borderColor={AppData.colors.text[400]}
                                        borderWidth={0.3}
                                        marginBottom={4}
                                        _focus={{
                                            borderColor: AppData.colors.primary,
                                            backgroundColor: "white",
                                        }}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                </View>
                                <TouchableOpacity style={{
                                    padding: 16,
                                    height: 60,
                                    alignSelf: 'center',
                                    backgroundColor: AppData.colors.danger,
                                    borderRadius: 16,
                                    alignItems: 'center',
                                    zIndex: 1,
                                    minWidth: 200
                                }}
                                    onPress={() => handleChangePassword()}
                                >
                                    <Text style={{
                                        fontSize: AppData.fontSizes.medium,
                                        fontWeight: "500",
                                        color: AppData.colors.text[100],
                                    }}>
                                        {"Lưu"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Actionsheet.Content>
                    </Actionsheet>
                </>
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
        width: 100,
        height: 100,
        borderRadius: 8,
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