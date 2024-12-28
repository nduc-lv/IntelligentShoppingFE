import React, { useEffect, useState, useCallback } from "react";
import { ChevronRight, Trash2 } from "lucide-react-native";
import { Plus } from "lucide-react-native";
import moment from "moment"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight, // Import ScrollView
} from "react-native";
import { useSelector } from "react-redux";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Calendar } from "lucide-react-native";
import { clearTokens } from "@/Store/reducers";
import {
  Form,
  Toast,
  DatePicker
} from "@ant-design/react-native";
import { useDispatch } from "react-redux";
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
import { TextInput } from "react-native-paper";
type ShoppingListRouteParams = {
  ShoppingListDetail: { groupId: string };
};

export const ShoppingListDetail: React.FC = () => {
  const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListDetail">>();
  const userData = useSelector((state: any) => state?.userApi?.queries[`getMe`]?.data);
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
  form.setFieldValue("date", new Date());

  // Load shopping lists on initial render or pagination change
  useEffect(() => {
    fetchShoppingList({ groupId, ...pagination });
  }, [groupId, pagination, fetchShoppingList]);
  useEffect(() => {
    fetchShoppingList({ groupId, ...pagination });
  }, [])

  const [items, setItems] = useState([{ food: "", unit: "", assignee: "", quantity: 0 }]);
  clearTokens()
  // Handle modal actions
  const handleModalOpen = (action: "create" | "edit" | "delete", item: Shopping | null = null) => {
    setCurrentAction(action);
    setSelectedItem(item);
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
      const values = await form.validateFields();
      const payload = {
        groupId: groupId,
        date: values.date,
        name: values.name,
        foods: []
      }
      await createShoppingList(payload).unwrap();
      toast.show("Shopping list created successfully!", { placement: "top", type: "success" });
      form.resetFields();
      setDate(new Date())
      fetchShoppingList({ groupId, ...pagination });
      handleModalClose();
    } catch (e) {
      console.log(e)
      toast.show("Failed to save shopping list", { placement: "top", type: "warning" });
    }
  };

  // Delete shopping list
  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteShoppingList(selectedItem.id).unwrap();
        toast.show("Shopping list deleted successfully!", { placement: "top", type: "success" });
        fetchShoppingList({ groupId, ...pagination });
        handleModalClose();
      } catch {
        toast.show("Failed to delete shopping list", { placement: "top", type: "warning" });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shopping Lists</Text>
      {/* <Button onPress={() => handleModalOpen("create")}>Create New Shopping List</Button> */}
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
              leftOpenValue={70}
            >
              {/* Hidden Row (Actions) */}
              <TouchableOpacity style={styles.deleteButton}  onPress={() => { handleModalOpen("delete", item); }}>
                 <Trash2></Trash2>
              </TouchableOpacity>
              {/* Visible Row */}
              <TouchableHighlight underlayColor={'#AAA'} onPress={() => { navigation.navigate("SHOPPING_LIST_BY_ID", { groupId, shoppingId: item.id }) }}>
                <View style={styles.groupItem}>
                  <View style={{gap: 5}}>
                    <Text>{moment(item.date).format("MM-DD-YY")}</Text>
                    <Text>{item.name}</Text>
                  </View>
                  <ChevronRight></ChevronRight>
                </View>
              </TouchableHighlight>
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
                    <Form.Item name="date" rules={[{ required: true, message: "Please select a date" }]}
                    >
                      <TouchableOpacity onPress={() => showDatepicker()} style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems:"center"}}>
                        <Text style={{fontSize: 20}}>
                          {moment(date).format("YYYY-MM-DD")}
                        </Text>
                        <Calendar/>
                      </TouchableOpacity>
                    </Form.Item>

                    <Form.Item name="name" rules={[{ required: true, message: "Please provide a name" }]}>
                      <TextInput style={styles.input} placeholder="Name" onChangeText={(value) => form.setFieldValue('name', value)} />
                    </Form.Item>
                    {/* Save Button */}
                  </Form>
                  <Modal.Footer>
                    <Button.Group style={{flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
                      <Button style={styles.button} onPress={handleModalClose}>Cancel</Button>
                      <Button style={styles.button} onPress={saveShoppingList}>
                        Save
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Body>
              </>
            )
          }
        </Modal.Content>
      </Modal>
      <TouchableOpacity style={styles.fab} onPress={() => handleModalOpen("create")}>
                <Plus color="white" size={25} />
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  groupItem: { padding: 12, backgroundColor: "#fff", marginBottom: 8, borderRadius: 8, flexDirection:"row" , justifyContent:"space-between"},
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  deleteButton: {
    padding: 12,
    alignItems: 'center',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'red',
    marginBottom: 8, borderRadius: 8 
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", margin: 16 },
  itemsContainer: { maxHeight: 400 },
  itemRow: { marginBottom: 12 },
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
input:{
  // borderWidth: 1,
  // borderColor: "#ccc",
  // borderRadius: 8,
  padding: 1,
  fontSize: 20,
  paddingHorizontal: 1,
  backgroundColor:"white"
},
button: {
  backgroundColor: "#53B175"
}
});
