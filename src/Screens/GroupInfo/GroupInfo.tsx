import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, GestureResponderEvent, FlatList, Modal, TextInput, Button, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, LogOut, LucideIcon, Pencil, Trash, UsersRound } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { useDeleteGroupMutation, useLazyGetGroupInfoQuery, useUpdateGroupMutation } from "@/Services/group";
import {
    Toast,
} from "antd-mobile";
import { useSafeArea } from "native-base";
import { RootScreens } from "..";
type GroupInfoListItem = { title: string; icon: LucideIcon, onClick?: (event: GestureResponderEvent) => void, disable: boolean, color?: string }
type GroupRouteParams = {
    GroupInfo: { groupId: string, isAdmin: boolean };
};

const renderSetting = ({ item }: { item: GroupInfoListItem }) => (
    <TouchableOpacity style={[styles.settingItem, item.disable && { display: "none" }]} onPress={item.onClick}>
        <item.icon size={24} color={item.color ? item.color : "#555"} />
        <Text style={[styles.settingText, item.color ? { color: item.color } : { color: "#333" }]}>{item.title}</Text>
    </TouchableOpacity>
);

export const GroupInfoScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "GroupInfo">>();
    const [newGroupName, setNewGroupName] = useState('');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const { groupId, isAdmin } = route.params;


    const [fetchGroupInfo, { data: info, isLoading: isLoadingInfo, isError: isErrorInfo }] = useLazyGetGroupInfoQuery();
    const [updateGroup] = useUpdateGroupMutation();
    const [deleteGroup] = useDeleteGroupMutation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleOpenEditDialog = () => {
        if (isAdmin) setEditModalVisible(true);
    };

    const handleCloseEditDialog = () => {
        setEditModalVisible(false);
        setNewGroupName('');
    };

    const handleOpenDeleteDialog = () => {
        if (isAdmin) setDeleteModalVisible(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteModalVisible(false);
    };

    const handleSave = async () => {
        try {
            if (!newGroupName) {
                Toast.show({ content: "Please fill in new group name.", icon: "fail" });
                return;
            }
            const payload = {
                name: newGroupName
            };
            await updateGroup({ id: groupId, ...payload }).unwrap();
            Toast.show({ content: "Group updated successfully!", icon: "success" });
            fetchGroupInfo({ groupId });
            handleCloseEditDialog();
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to save group infomation.", icon: "fail" });
        }
    }

    const handleDelete = async () => {
        try {
            if(isAdmin){
                await deleteGroup(groupId);
                Toast.show({ content: "Group deleted successfully!", icon: "success" });
                handleCloseDeleteDialog();
                navigation.navigate(RootScreens.MAIN);
            }
            else{
                Toast.show({ content: "You are not group admin!", icon: "fail" });
            }
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to delete group.", icon: "fail" });
        }
    }

    const settings: Array<GroupInfoListItem> = [
        {
            title: "Change Group Name", icon: Pencil, onClick: (e) => {
                handleOpenEditDialog();
            }, disable: !isAdmin
        },
        {
            title: "Members", icon: UsersRound, onClick: (e) => {
                navigation.navigate("USERGROUP", { groupId: groupId, isAdmin: isAdmin, groupName: info.rows[0].group.name ?? "Unknown" })
            }, disable: false
        },
        {
            title: "Leave Group", icon: LogOut, onClick: (e) => {
                console.log("leave");
            }, disable: isAdmin, color: "red"
        },
        {
            title: "Delete Group", icon: Trash, onClick: (e) => {
                handleOpenDeleteDialog();
            }, disable: !isAdmin, color: "red"
        },
    ];

    useEffect(() => {
        fetchGroupInfo({ groupId });
    }, [groupId, fetchGroupInfo]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("GROUP_DETAIL", { groupId: groupId, isAdmin: isAdmin })}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
            </View>
            {isLoadingInfo ? (
                <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
            ) : isErrorInfo ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Failed to load shopping lists.</Text>
                </View>
            ) : info ? (
                <View>
                    <View style={styles.imageContainer}>
                        <Image
                            // source={{
                            //     uri: data.link_avatar,
                            // }}
                            defaultSource={{ uri: "https://via.placeholder.com/150" }}
                            style={styles.image}
                        />
                        <Text style={styles.groupName}>{info.rows[0].group.name ?? "Unknown"}</Text>
                    </View>
                    <FlatList
                        data={settings}
                        renderItem={renderSetting}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.settingsList}
                    />
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={editModalVisible}
                        onRequestClose={() => handleCloseEditDialog()}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Enter New Group Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Group Name"
                                    value={newGroupName}
                                    onChangeText={setNewGroupName}
                                />
                                <View style={styles.buttonContainer}>
                                    <Button title="Cancel" onPress={() => handleCloseEditDialog()} />
                                    <Button title="Save" onPress={() => handleSave()} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={deleteModalVisible}
                        onRequestClose={() => handleCloseDeleteDialog()}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Confirm Delete</Text>
                                <Text style={styles.modalMessage}>
                                    Are you sure you want to delete this group? This action cannot be undone.
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button title="Cancel" onPress={() => handleCloseDeleteDialog()} />
                                    <Button title="Delete" onPress={() => handleDelete()} color="red" />
                                </View>
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
    groupName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    imageContainer: {
        alignItems: "center",
        margin: 16,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    settingText: {
        marginLeft: 16,
        fontSize: 16,
        // color: "#333",
    },
    settingsList: {
        marginTop: 16,
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red" },
    modalMessage: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
    },
});