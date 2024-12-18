import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, GestureResponderEvent, FlatList, Modal, TextInput, Button, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useLazyGetAllUserGroupQuery } from "@/Services/usergroup";
import { ArrowLeft, Info, LogOut, LucideIcon, Pencil, UsersRound } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { useLazyGetGroupInfoQuery, useUpdateGroupMutation } from "@/Services/group";
import {
    Toast,
} from "antd-mobile";
type GroupInfoListItem = { title: string; icon: LucideIcon, onClick?: (event: GestureResponderEvent) => void, disable: boolean }
type GroupRouteParams = {
    GroupInfo: { groupId: string, isAdmin: boolean };
};

const renderSetting = ({ item }: { item: GroupInfoListItem }) => (
    <TouchableOpacity style={[styles.settingItem, item.disable && {display: "none"}]} onPress={item.onClick}>
        <item.icon size={24} color="#555" />
        <Text style={styles.settingText}>{item.title}</Text>
    </TouchableOpacity>
);

export const GroupInfoScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "GroupInfo">>();
    const [newGroupName, setNewGroupName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { groupId, isAdmin } = route.params;

    
    const [fetchGroupInfo, { data: info, isLoading: isLoadingInfo, isError: isErrorInfo }] = useLazyGetGroupInfoQuery();
    const [updateGroup] = useUpdateGroupMutation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [pagination, setPagination] = useState({ page: 1, per: 10 });

    const handleOpenDialog = () => {
        if(isAdmin) setModalVisible(true);
    };

    const handleCloseDialog = () => {
        setModalVisible(false);
        setNewGroupName('');
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
            handleCloseDialog();
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to save group infomation.", icon: "fail" });
        }
    }

    const settings: Array<GroupInfoListItem> = [
        {
            title: "Change Group Name", icon: Pencil, onClick: (e) => {
                handleOpenDialog();
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
            }, disable: isAdmin
        },
    ];

    useEffect(() => {
        // fetchUserGroupList({ groupId, ...pagination });
        fetchGroupInfo({ groupId });
    }, [groupId, pagination, fetchGroupInfo]);

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
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
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
                                    <Button title="Cancel" onPress={() => handleCloseDialog()} />
                                    <Button title="Save" onPress={() => handleSave()} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            ) : (
<               Text>No info found.</Text>
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
        color: "#333",
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
});