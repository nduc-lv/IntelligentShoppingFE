import { UnitResponse, useCreateUnitMutation, useDeleteUnitMutation, useLazyGetUnitQuery, useUpdateUnitMutation } from "@/Services/unit";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";
import { RootScreens } from "..";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import {
    Toast,
} from "antd-mobile";

export const ManageUnitScreen = () => {
    const [fetchUnit, { data, isLoading, isError }] = useLazyGetUnitQuery();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [createUnit] = useCreateUnitMutation();
    const [updateUnit] = useUpdateUnitMutation();
    const [deleteUnit] = useDeleteUnitMutation();
    const [modalOption, setModalOption] = useState('');
    const [newUnitName, setNewUnitName] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<UnitResponse | null>();

    const handleOpenDialog = (option: string, item: UnitResponse | null = null) => {
        setModalOption(option);
        if (item) setNewUnitName(item.name);
        setSelectedUnit(item);
    };

    const handleCloseDialog = () => {
        setModalOption('');
        setNewUnitName('');
        setSelectedUnit(null);
    };

    const handleSubmit = async () => {
        try {
            if (!newUnitName) {
                console.log(1)
                Toast.show({ content: "Please fill in new unit name.", icon: "fail" });
                return;
            }
            const payload = {
                name: newUnitName
            };
            if (modalOption === 'create') {
                await createUnit(payload).unwrap();
            }
            if (modalOption === 'edit') {
                if (!selectedUnit) {
                    Toast.show({ content: "Please select an unit.", icon: "fail" });
                    return;
                }
                await updateUnit({ id: selectedUnit.id, ...payload }).unwrap();
            }
            Toast.show({ content: "Unit saved successfully!", icon: "success" });
            fetchUnit();
            handleCloseDialog();
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to save unit infomation.", icon: "fail" });
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteUnit(id);
            Toast.show({ content: "Unit deleted successfully!", icon: "success" });
            fetchUnit();         
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to delete group.", icon: "fail" });
        }
    }

    useEffect(() => {
        fetchUnit();
    }, [fetchUnit]);

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
                        <Text style={styles.title}>{"Quản lý đơn vị"}</Text>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.unitItem}>
                                <Text style={styles.unitName}>{item.name}</Text>
                                <View style={styles.actionIcons}>
                                    <TouchableOpacity onPress={() => handleOpenDialog('edit', item)}>
                                        <Edit size={24} color="#007AFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                        <Trash size={24} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                </View>
            ) : (
                <Text>No info found.</Text>
            )}
            <TouchableOpacity style={styles.fab} onPress={() => handleOpenDialog('create')}>
                <Plus color="white" size={25} />
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalOption === 'create' || modalOption === 'edit'}
                onRequestClose={() => handleCloseDialog()}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter New Unit Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Unit Name"
                            value={newUnitName}
                            onChangeText={setNewUnitName}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Cancel" onPress={() => handleCloseDialog()} />
                            <Button title={modalOption === 'create' ? "Create" : "Save"} onPress={() => handleSubmit()} />
                        </View>
                    </View>
                </View>
            </Modal>
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
    unitItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    unitName: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16, // Khoảng cách giữa các biểu tượng
    },
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
        marginBottom: 16,
        fontSize: 16,
    },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
});