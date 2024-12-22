import React, { useEffect, useState, useCallback } from "react";
import SwipeRow from '@nghinv/react-native-swipe-row'
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
  Form,
  Toast,
  DatePicker
} from "@ant-design/react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { Select, FormControl, WarningOutlineIcon, CheckIcon, Modal, Button, Input } from "native-base";
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
import { useToast } from 'react-native-toast-notifications'
type ShoppingListRouteParams = {
  ShoppingListDetail: { groupId: string };
};

export const ShoppingListDetail: React.FC = () => {
  const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListDetail">>();
  const userData = useSelector((state: any) => state?.userApi?.queries[`getMe`]?.data);
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
  const [date, setDate] = useState(new Date());
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate)
    setDate(currentDate)
    form.setFieldValue("date", moment(currentDate).format("YYYY-MM-DD"))
  };
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const toast = useToast();
  const showDatepicker = () => {
    showMode('date');
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
      const payload = {
        groupId: groupId,
        date: values.date,
        name: values.name,
        foods: []
      }
      await createShoppingList(payload).unwrap();
      toast.show("Shopping list created successfully!", {placement:"top", type: "success" });
      // if (currentAction === "create") {
      // } else if (currentAction === "edit" && selectedItem) {
      //   await updateShoppingList({ id: selectedItem.id, ...payload }).unwrap();
      //   Toast.show({ content: "Shopping list updated successfully!", icon: "success" });
      // }
      fetchShoppingList({ groupId, ...pagination });
      handleModalClose();
    } catch (e) {
      console.log(e)
      toast.show("Failed to save shopping list", {placement:"top", type: "warning" });
    }
  };

  // Delete shopping list
  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteShoppingList(selectedItem.id).unwrap();
        toast.show("Shopping list deleted successfully!", {placement:"top", type: "success" });
        fetchShoppingList({ groupId, ...pagination });
        handleModalClose();
      } catch {
        toast.show("Failed to delete shopping list", { placement:"top", type: "warning" });
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
            <SwipeRow
            left={[
              { title: 'Delete', 
                backgroundColor: 'tomato', 
                icon: {name: 'delete'},
                onPress: () => { handleModalOpen("delete", item)
              }
            },
            ]}
            >
              <TouchableOpacity style={styles.groupItem} onPress={() => { navigation.navigate("SHOPPING_LIST_BY_ID", { groupId, shoppingId: item.id }) }}>
                <View>
                  <Text>{moment(item.date).format("MM-DD-YY")}</Text>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  {/* <Button onPress={() => { navigation.navigate("SHOPPING_LIST_BY_ID", { groupId, shoppingId: item.id }) }}>Edit</Button> */}
                  <Button onPress={() => { handleModalOpen("delete", item); }}>Delete</Button>
                </View>
              </TouchableOpacity>
            </SwipeRow>
          )}
          // onEndReached={() =>
          //   setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          // }
          onEndReachedThreshold={0.5}
        />
      ) : (
        <Text>No shopping lists found.</Text>
      )}

      <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <Modal.Content>
          {currentAction == 'delete' && (
            <>
              <Modal.CloseButton />
              <Modal.Header>Delete</Modal.Header>
              <Modal.Body>
                <Text> Are you sure you want to delete this?</Text>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button onPress={confirmDelete}>Confirm Delete</Button>
                    <Button onPress={handleModalClose}>Cancel</Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Body>
            </>
          )}
          {
            currentAction == 'create' && (
              <>
                <Modal.CloseButton />
                <Modal.Header>Create</Modal.Header>
                <Modal.Body>
                  <Form form={form}>
                    <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}
                    >
                      <Text>
                          Date: {moment(date).format("YYYY-MM-DD")}
                      </Text>
                      <Button onPress={() => showDatepicker()}>
                        Choose Date
                      </Button>
                    </Form.Item>

                    <Form.Item name="name" label="name" rules={[{ required: true, message: "Please select a date" }]}>
                      <Input mx="3" placeholder="Input" w="100%" onChangeText={(value) => form.setFieldValue('name', value)} />
                    </Form.Item>
                    {/* Save Button */}
                  </Form>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button onPress={saveShoppingList}>
                        Save Shopping List
                      </Button>
                      <Button onPress={handleModalClose}>Cancel</Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Body>
              </>
            )
          }
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
