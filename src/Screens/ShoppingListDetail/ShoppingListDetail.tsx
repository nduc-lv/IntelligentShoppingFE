import React, { useEffect, useState, useCallback } from "react";
import moment from "moment"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView, // Import ScrollView
} from "react-native";
import {
  Button,
  Popup,
  Input,
  Form,
  Space,
  Toast,
} from "antd-mobile";
import { Select, FormControl, WarningOutlineIcon, CheckIcon } from "native-base";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Shopping, useLazyGetAllUserQuery } from "@/Services/shoppingList";
import {
  useLazyGetShoppingListQuery,
  useDeleteShoppingListMutation,
  useCreateShoppingListMutation,
  useUpdateShoppingListMutation,
  useLazyGetAllUnitQuery,
  useLazyGetAllFoodQuery,
} from "@/Services/shoppingList";

type ShoppingListRouteParams = {
  ShoppingListDetail: { groupId: string };
};

export const ShoppingListDetail: React.FC = () => {
  const mockUserId = "84ef5319-acef-4d19-b048-fdf00ff3e386";
  const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListDetail">>();
  const { groupId } = route.params;

  const [fetchShoppingList, { data: rows = [], isLoading, isError }] = useLazyGetShoppingListQuery();
  const [deleteShoppingList] = useDeleteShoppingListMutation();
  const [updateShoppingList] = useUpdateShoppingListMutation();
  const [createShoppingList] = useCreateShoppingListMutation();
  const [fetchUnitList, { data: units = [] }] = useLazyGetAllUnitQuery();
  const [fetchFoodList, { data: foods = [] }] = useLazyGetAllFoodQuery();
  const [fetchUserList, { data: users = [] }] = useLazyGetAllUserQuery();

  const [pagination, setPagination] = useState({ page: 1, per: 10 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Shopping | null>(null);
  const [form] = Form.useForm();

  // Load shopping lists on initial render or pagination change
  useEffect(() => {
    fetchShoppingList({ groupId, ...pagination });
  }, [groupId, pagination, fetchShoppingList]);

  const [items, setItems] = useState([{ food: "", unit: "", assignee: "" }]);

  // Fetch food and unit data only when needed
  const loadPickerData = useCallback(() => {
    fetchFoodList({ userId: mockUserId });
    fetchUnitList({ userId: mockUserId });
    fetchUserList({groupId: groupId});
  }, [fetchFoodList, fetchUnitList, fetchUserList]);

  // Add new item
  const addItem = () => {
    setItems([...items, { food: "", unit: "", assignee: "" }]);
  };

  // Remove an item
  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Update item values
  const updateItem = (index: number, key: string, value: string) => {
    const updatedItems: Array<{ food: string; assignee: string; unit: string;[key: string]: string }> = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
  };

  // Handle modal actions
  const handleModalOpen = (action: "create" | "edit" | "delete", item: Shopping | null = null) => {
    setCurrentAction(action);
    setSelectedItem(item);
    if (action !== "delete") {
      loadPickerData();
      form.resetFields();
      if (action === "edit" && item) {
        form.setFieldsValue({ date: item.date, items: item.foods });
      }
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };
  // Save shopping list (create or update)
  const saveShoppingList = async () => {
    try {
      // Validate the items fields
      let isValid = true;
      for (const item of items) {
        if (!item.food || !item.unit || !item.assignee) {
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        Toast.show({ content: "Please fill in all fields for each item.", icon: "fail" });
        return;
      }
      
      const values = await form.validateFields();
      console.log(items);
      console.log(values)
      // {name, date, groupId, foods: [{food_id, quantity, user_id, unit_id}]}
      if (currentAction === "create") {
        const payload = {
          groupId: groupId,
          date: values.date,
          name: "Default",
          foods: items.map(item => {
            return {
              food_id: item.food,
              quantity: 1,
              user_id: item.assignee,
              unit_id: item.unit
            }
          })
        }
        await createShoppingList(payload).unwrap();
        Toast.show({ content: "Shopping list created successfully!", icon: "success" });
      } else if (currentAction === "edit" && selectedItem) {
        // await updateShoppingList({ id: selectedItem.id, ...values }).unwrap();
        Toast.show({ content: "Shopping list updated successfully!", icon: "success" });
      }
      fetchShoppingList({ groupId, ...pagination });
      handleModalClose();
    } catch (e) {
      console.log(e)
      Toast.show({ content: "Failed to save shopping list.", icon: "fail" });
    }
  };

  // Delete shopping list
  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteShoppingList(selectedItem.id).unwrap();
        Toast.show({ content: "Shopping list deleted successfully!", icon: "success" });
        fetchShoppingList({ groupId, ...pagination });
        handleModalClose();
      } catch {
        Toast.show({ content: "Failed to delete shopping list.", icon: "fail" });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shopping Lists</Text>
      <Button onClick={() => handleModalOpen("create")}>Create New Shopping List</Button>

      {isLoading ? (
        <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load shopping lists.</Text>
        </View>
      ) : rows.length > 0 ? (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <Text>{moment(item.date).format("MM-DD-YY")}</Text>
              <Text>{item.name}</Text>
              <View style={styles.buttonContainer}>
                <Button onClick={() => { handleModalOpen("edit", item); }}>Edit</Button>
                <Button onClick={() => { handleModalOpen("delete", item); }}>Delete</Button>
              </View>
            </View>
          )}
          // onEndReached={() =>
          //   setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          // }
          onEndReachedThreshold={0.5}
        />
      ) : (
        <Text>No shopping lists found.</Text>
      )}

      <Popup
        visible={isModalVisible}
        onMaskClick={handleModalClose}
        position="bottom"
        destroyOnClose
      >
        {currentAction === "delete" ? (
          <View style={styles.modalButtons}>
            <Button onClick={confirmDelete}>Confirm Delete</Button>
            <Button onClick={handleModalClose}>Cancel</Button>
          </View>
        ) : (
          <Form form={form} layout="vertical">
            {/* Date Field */}
            <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}>
              <Input type="date" />
            </Form.Item>

            {/* Scrollable Items */}
            <ScrollView style={styles.itemsContainer} keyboardShouldPersistTaps="handled">
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <FormControl isInvalid={!item.food}>
                    <Select
                      minWidth="200"
                      placeholder="Select Food"
                      _selectedItem={{
                        bg: 'teal.600',
                        endIcon: <CheckIcon size={5} />,
                      }}
                      onValueChange={(value: any) => updateItem(index, "food", value)}
                    >
                      {foods.map((food) => (
                        <Select.Item key={food.id} label={food.name} value={food.id} />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      Please select a food item!
                    </FormControl.ErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!item.unit}>
                    <Select
                      minWidth="200"
                      placeholder="Select Unit"
                      _selectedItem={{
                        bg: 'teal.600',
                        endIcon: <CheckIcon size={5} />,
                      }}
                      onValueChange={(value: any) => updateItem(index, "unit", value)}
                    >
                      {units.map((unit) => (
                        <Select.Item key={unit.id} label={unit.name} value={unit.id} />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      Please select a unit!
                    </FormControl.ErrorMessage>
                  </FormControl>

                  {/* <Input
                    placeholder="Enter Assignee"
                    value={item.assignee}
                    onChange={(value) => updateItem(index, "assignee", value)}
                  /> */}

                  <FormControl isInvalid={!item.assignee}>
                    <Select
                      minWidth="200"
                      placeholder="Select Assignee"
                      _selectedItem={{
                        bg: 'teal.600',
                        endIcon: <CheckIcon size={5} />,
                      }}
                      onValueChange={(value: any) => updateItem(index, "assignee", value)}
                    >
                      {users.map((user) => (
                        <Select.Item key={user.id} label={user.name} value={user.id} />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      Please select an assignee!
                    </FormControl.ErrorMessage>
                  </FormControl>

                  {/* Remove Button */}
                  <Button onClick={() => removeItem(index)} color="danger" size="small">
                    Remove
                  </Button>
                </View>
              ))}
            </ScrollView>

            {/* Add Button */}
            <Button onClick={addItem} block>
              Add Item
            </Button>

            {/* Save Button */}
            <Button onClick={saveShoppingList} block>
              Save Shopping List
            </Button>
          </Form>
        )}
      </Popup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  groupItem: { padding: 12, backgroundColor: "#fff", marginBottom: 8, borderRadius: 8 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", margin: 16 },
  itemsContainer: { maxHeight: 400 }, // You can adjust the height based on your needs
  itemRow: { marginBottom: 12 }, // Add margin for spacing between items
});
