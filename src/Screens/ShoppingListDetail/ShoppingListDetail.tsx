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
import { useSelector } from "react-redux";
import {
  Popup,
  Input,
  Form,
  Space,
  Calendar,
  Toast,
  CalendarPicker,
  DatePicker
} from "antd-mobile";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { Select, FormControl, WarningOutlineIcon, CheckIcon, Modal, Button } from "native-base";
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
  const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListDetail">>();
  const userData = useSelector((state:any) => state?.userApi?.queries[`getMe`]?.data);
  const mockUserId = userData?.id;
  const { groupId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [fetchShoppingList, { data: rows = [], isLoading, isError }] = useLazyGetShoppingListQuery();
  const [showModal, setShowModal] = useState<boolean>(false);
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
  useEffect(() => {
    fetchShoppingList({ groupId, ...pagination });
  }, [])

  const [items, setItems] = useState([{ food: "", unit: "", assignee: "", quantity: 0 }]);

  // Fetch food and unit data only when needed
  const loadPickerData = useCallback(() => {
    fetchFoodList({ userId: mockUserId });
    fetchUnitList({ userId: mockUserId });
    fetchUserList({ groupId: groupId });
  }, [fetchFoodList, fetchUnitList, fetchUserList]);

  // Add new item
  const addItem = () => {
    setItems([...items, { food: "", unit: "", assignee: "", quantity: 0 }]);
  };

  // Remove an item
  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Update item values
  const updateItem = (index: number, key: string, value: string | number) => {
    const updatedItems: Array<{ food: string; assignee: string; unit: string; quantity: number;[key: string]: string | number }> = [...items];
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
        form.setFieldsValue({ date: moment(item.date).format("MM-DD-YY") });
        const items = item.tasks.map(item => {
          return {
            food: item?.food_id,
            unit: item?.unit_id,
            assignee: item?.task?.user_id,
            quantity: item?.quantity || 0
          }
        })
        setItems([...items]);
      }
      if (action === "create") {
        setItems([{ food: "", assignee: "", unit: "", quantity: 0 }]);
      }
    }
    setIsModalVisible(true);
  };
  const [showCalendar, setShowCalendar] = useState(false);


  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };
  // Save shopping list (create or update)
  const saveShoppingList = async () => {
    try {
      // Validate the items fields
      // let isValid = true;
      // for (const item of items) {
      //   if (!item.food || !item.unit || !item.assignee) {
      //     isValid = false;
      //     break;
      //   }
      // }
      // if (!isValid) {
      //   Toast.show({ content: "Please fill in all fields for each item.", icon: "fail" });
      //   return;
      // }

      const values = await form.validateFields();
      // {name, date, groupId, foods: [{food_id, quantity, user_id, unit_id}]}
      const payload = {
        groupId: groupId,
        date: values.date,
        name: "Default",
        foods:[]
      }
      await createShoppingList(payload).unwrap();
      Toast.show({ content: "Shopping list created successfully!", icon: "success" });
      // if (currentAction === "create") {
      // } else if (currentAction === "edit" && selectedItem) {
      //   await updateShoppingList({ id: selectedItem.id, ...payload }).unwrap();
      //   Toast.show({ content: "Shopping list updated successfully!", icon: "success" });
      // }
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
      <Button onPress={() => handleModalOpen("create")}>Create New Shopping List</Button>

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
                <Button onPress={() => { navigation.navigate("SHOPPING_LIST_BY_ID", { groupId, shoppingId: item.id })}}>Edit</Button>
                <Button onPress={() => { handleModalOpen("delete", item); }}>Delete</Button>
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
            <Button onPress={confirmDelete}>Confirm Delete</Button>
            <Button onPress={handleModalClose}>Cancel</Button>
          </View>
        ) : (
          <Form form={form} layout="vertical">
            {/* Date Field */}
            <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}
            >
              <Input
                readOnly
                value={moment(form.getFieldValue("date")).format("MM-DD-YY")}
                onClick={() => setShowCalendar(true)}
              />
              <Button onPress={() => setShowCalendar(true)}>
                Choose Date
              </Button>
              <DatePicker
                title='Choose Date'
                visible={showCalendar}
                confirmText="Confirm"
                cancelText="Cancle"
                onClose={() => {
                  setShowCalendar(false);
                }}
                onConfirm={val => {
                  form.setFieldValue("date", moment(val).format("MM-DD-YYYY"))
                  Toast.show(val.toDateString())
                }}
              />
            </Form.Item>

            {/* Scrollable Items */}
            {/* <ScrollView style={styles.itemsContainer} keyboardShouldPersistTaps="handled">
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <FormControl isInvalid={!item.food}>
                    <Select
                      minWidth="200"
                      placeholder="Select Food"
                      defaultValue={item.food || undefined}
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
                      defaultValue={item.unit || undefined}
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

                  {/* <FormControl isInvalid={!item.assignee}>
                    <Select
                      minWidth="200"
                      placeholder="Select Assignee"
                      defaultValue={item.assignee || undefined}
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

                  <FormControl isInvalid={!item.food}> */}
                    {/* <Select
                      minWidth="200"
                      placeholder="Choose Quantity"
                      defaultValue={item.food || undefined}
                      _selectedItem={{
                        bg: 'teal.600',
                        endIcon: <CheckIcon size={5} />,
                      }}
                      onValueChange={(value: any) => updateItem(index, "food", value)}
                    >
                      {foods.map((food) => (
                        <Select.Item key={food.id} label={food.name} value={food.id} />
                      ))}
                    </Select> */}
                    {/* <Input type="number" placeholder="Choose Quantity" onChange={(value => updateItem(index, "quantity", value))} defaultValue={`${item.quantity || 0}`}></Input>
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      Please select food quantity!
                    </FormControl.ErrorMessage>
                  </FormControl> */}

                  {/* Remove Button */}
                  {/* <Button onPress={() => removeItem(index)} color="danger" size="small">
                    Remove
                  </Button> */}

                  {/* Add to fridge button */}
                  {/* <Button onPress={() => setShowModal(true)} color="danger" size="small">
                    Add To Fridge
                  </Button> */}
                {/* </View>
              ))}
            </ScrollView> */} 

            {/* Add Button */}
            {/* <Button onPress={addItem}>
              Add Item
            </Button> */}

            {/* Save Button */}
            <Button onPress={saveShoppingList}>
              Save Shopping List
            </Button>
          </Form>
        )}
      </Popup>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Contact Us</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                setShowModal(false);
              }}>
                Cancel
              </Button>
              <Button onPress={() => {
                setShowModal(false);
              }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
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
