import { Group, useCreateGroupMutation, useLazyGetAllGroupQuery } from "@/Services/group";
import { ChevronRight, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import {
  Toast,
} from "antd-mobile";
import { useLazyGetAllCategoryQuery } from "@/Services/category";
import { useLazyGetAllFoodQuery } from "@/Services/shoppingList";
import { useLazyGetUnitsQuery } from "@/Services/unit";
import { useLazyGetAllFood2Query } from "@/Services/food";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Store";
import { setCategory, setUnit, setFood } from "@/Store/reducers/data";
import AppData from "@/General/Constants/AppData";

export const GroupScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [fetchGroup, { data = [], isLoading, isError, error }] = useLazyGetAllGroupQuery();
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [createGroup] = useCreateGroupMutation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [fetchAllCategory, { data: categorys, isLoading: isLoadingAllCategory, isError: isErrorAllCategory }] = useLazyGetAllCategoryQuery();
  const [fetchAllFood, { data: foods, isLoading: isLoadingAllFood, isError: isErrorAllFood }] = useLazyGetAllFood2Query();
  const [fetchAllUnit, { data: units, isLoading: isLoadingAllUnit, isError: isErrorAllUnit }] = useLazyGetUnitsQuery();

  useEffect(() => {
    fetchAllCategory();
    fetchAllUnit();
    fetchAllFood();
  }, []);

  useEffect(() => {
    dispatch(setCategory(categorys));
    dispatch(setUnit(units));
    dispatch(setFood(foods));
  }, [categorys, units, foods]);

  const handleOpenDialog = () => {
    setModalVisible(true);
  };

  const handleCloseDialog = () => {
    setModalVisible(false);
    setNewGroupName('');
  };

  const handleCreate = async () => {
    try {
      if (!newGroupName) {
        Toast.show({ content: "Please fill in new group name.", icon: "fail" });
        return;
      }
      const payload = {
        name: newGroupName
      };
      await createGroup(payload).unwrap();
      Toast.show({ content: "Group updated successfully!", icon: "success" });
      fetchGroup();
      handleCloseDialog();
    } catch (e) {
      console.log(e)
      Toast.show({ content: "Failed to save group infomation.", icon: "fail" });
    }
  }

  useEffect(() => {
    fetchGroup();
  }, []);

  console.log(data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>
      {isLoading ? (
        <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load groups.</Text>
        </View>
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.group_id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("GROUP_DETAIL", { groupId: item.group_id, isAdmin: item.is_admin })}>
              <View style={styles.groupItem}>
                <View style={styles.leftContent}>
                  <Image
                    defaultSource={{ uri: "https://via.placeholder.com/150" }}
                    style={styles.groupImage}
                  />
                  <Text style={styles.itemText}>{item.name}</Text>
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
      <TouchableOpacity style={styles.fab} onPress={() => handleOpenDialog()}>
        <Plus color="white" size={25} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
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
              <Button title="Create" onPress={() => handleCreate()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    boxShadow: '2px 2px 2px 0px #0633361A',
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
    bottom: 35,
    right: 25,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: AppData.colors.primary,
    display: "flex",
    borderRadius: 16,
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
});