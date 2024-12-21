import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import lodash from "lodash";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Toast, DatePicker, Form, Input } from "antd-mobile";
import { FormControl, Select, WarningOutlineIcon, CheckIcon, Modal, Button } from "native-base";
import { useSelector } from "react-redux";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
    useLazyGetItemByShoppingListIdQuery,
    useDeleteShoppingListMutation,
    useCreateShoppingListMutation,
    useUpdateShoppingListMutation,
    useLazyGetAllUnitQuery,
    useLazyGetAllFoodQuery,
    useLazyGetAllUserQuery,
    useAddShoppingItemToFridgeMutation,
    useDeleteShoppingItemByIdMutation,
} from "@/Services/shoppingList";

import { useLazyGetMeQuery } from "@/Services";

type ShoppingListRouteParams = {
    ShoppingListById: { shoppingId: string; groupId: string };
};

type Item = {
    id?: string | undefined;
    food: string;
    unit: string;
    assignee: string;
    quantity: number;
    [key: string]: string | number | undefined
};

const ItemRow: React.FC<{
    index: number;
    item: Item;
    foods: Array<{ id: string; name: string }>;
    units: Array<{ id: string; name: string }>;
    users: Array<{ id: string; name: string }>;
    onUpdate: (index: number, key: string, value: string | number) => void;
    onRemove: () => void;
    setAction: any;
    setIsModalVisible: any;
    setSelectedItem: any;
}> = React.memo(({ index, item, foods, units, users, onUpdate, onRemove, setIsModalVisible, setAction, setSelectedItem }) => (
    <ScrollView style={styles.itemRow}>
        <FormControl isInvalid={!item.food}>
            <Select
                placeholder="Select Food"
                selectedValue={item.food}
                onValueChange={(value) => onUpdate(index, "food", value)}
                _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
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
                placeholder="Select Unit"
                selectedValue={item.unit}
                onValueChange={(value) => onUpdate(index, "unit", value)}
                _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
            >
                {units.map((unit) => (
                    <Select.Item key={unit.id} label={unit.name} value={unit.id} />
                ))}
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Please select a unit!
            </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={!item.assignee}>
            <Select
                placeholder="Select Assignee"
                selectedValue={item.assignee}
                onValueChange={(value) => onUpdate(index, "assignee", value)}
                _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
            >
                {users.map((user) => (
                    <Select.Item key={user.id} label={user.name} value={user.id} />
                ))}
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Please select an assignee!
            </FormControl.ErrorMessage>
        </FormControl>

        <Input
            type="number"
            placeholder="Enter Quantity"
            // keyboardType="numeric"
            value={`${item.quantity}`}
            onChange={(value) => onUpdate(index, "quantity", Number(value))}
        />
        {!item.id && <Button onPress={onRemove} colorScheme="danger" size="sm">
            Remove
        </Button>}
        {item.id &&
            <Button onPress={() => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'delete') }}>
                Delete
            </Button>
        }
        {
            item.id &&
            <Button onPress={() => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'addToFridge') }}>
                Save To Fridge
            </Button>
        }

        {/* {item.id && <Button onPress={dele}} */}
        {/* TODO: DELETE ITEM + ADD TO THE FRIDGE + BUILD INFINITYES */}
    </ScrollView>
));

// const mockerUserId = '67ecf6e5-c4aa-461f-930f-e03fe0f8f6b2'
export const ShoppingListById: React.FC = () => {
    const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListById">>();
    // const userData = useSelector((state:any) => state?.userApi?.queries[`getMe`]?.data);
    const [getMe, { data: userInfo }] = useLazyGetMeQuery();
    // const mockerUserId = userData?.id;
    const { groupId, shoppingId } = route.params;
    const [pagination, setPagination] = useState({ page: 1, per: 10 });
    const [selectedItem, setSelectedItem] = useState<Item>();
    const [fetchShoppingListById, { data: rows = [], isLoading, isError }] = useLazyGetItemByShoppingListIdQuery();
    const [updateShoppingList, { isError: isUpdateError }] = useUpdateShoppingListMutation();
    const [addItemToFridge, { isError: isAddError }] = useAddShoppingItemToFridgeMutation();
    const [deleteShoppingItem, { isError: isDeleteError }] = useDeleteShoppingItemByIdMutation();
    const [form] = Form.useForm();
    const [fetchUnitList, { data: units = [] }] = useLazyGetAllUnitQuery();
    const [fetchFoodList, { data: foods = [] }] = useLazyGetAllFoodQuery();
    const [fetchUserList, { data: users = [] }] = useLazyGetAllUserQuery();
    const [formAddFridge] = Form.useForm();
    const [items, setItems] = useState<Item[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const deleteShoppingItemById = async (item) => {
        try {
            await deleteShoppingItem(item.id)
            if (isDeleteError) {
                Toast.show("Failed");
                return;
            }
            Toast.show("success")
        }
        catch (e) {
            console.log(e);
            Toast.show("FAILED")
        }
        finally {
            await fetchShoppingListById({ shoppingId, ...pagination });
            setIsModalVisible(false)
        }
    }
    useEffect(() => {
        if (userInfo) {
            fetchShoppingListById({ shoppingId, ...pagination });
            fetchFoodList({ userId: userInfo.id });
            fetchUnitList({ userId: userInfo.id });
            fetchUserList({ groupId });
        }
    }, [userInfo, groupId, shoppingId, fetchShoppingListById, fetchFoodList, fetchUnitList, fetchUserList]);

    useEffect(() => {
        getMe()
    }, [])
    useEffect(() => {
        if (rows && rows.length >= 0) {
            const updatedItems = rows.map((row, index) => {
                if (index == 0) {
                    form.setFieldValue('date', row.shopping.date);
                    form.setFieldValue('name', row.shopping.name)
                }
                return ({
                    id: row.id,
                    food: row.food_id || "",
                    unit: row.unit_id || "",
                    assignee: row.task.user_id || "",
                    quantity: row.quantity || 0,
                })
            });
            setItems((prev) => [...updatedItems]);
        }
    }, [rows]);
    const addItem = () => setItems([...items, { food: "", unit: "", assignee: "", quantity: 0 }]);
    const [action, setAction] = useState<"addToFridge" | "delete" | null>(null);
    const updateItem = (index: number, key: string, value: string | number) => {
        const updatedItems = [...items];
        updatedItems[index][key] = value;
        setItems(updatedItems);
    };
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const saveShoppingList = async () => {
        try {
            // compare items and orginalItems
            let isValid = true;
            const isExist = {};
            for (const item of items) {
                if (isExist[item.food]) {
                    Toast.show({ content: "Duplicate Food", icon: "fail" });
                    return;
                }
                isExist[item.food] = 1;
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
            const addedItems = items.filter(item => !item.id);
            const updatedItems = items.filter(item => item.id);
            const payload = {
                groupId: groupId,
                date: values.date,
                name: values.name,
                foods: [
                    ...addedItems.map(item => ({
                        food_id: item.food,
                        quantity: item.quantity,
                        user_id: item.assignee,
                        unit_id: item.unit
                    })),
                    ...updatedItems.map(item => ({
                        id: item.id,
                        food_id: item.food,
                        quantity: item.quantity,
                        user_id: item.assignee,
                        unit_id: item.unit
                    }))
                ]
            }
            await updateShoppingList({ id: shoppingId, ...payload });
            if (isUpdateError) {
                Toast.show("Failed")
            }
            else {
                Toast.show("Success")
                console.log("successfully save shopping list")
            }
            await fetchShoppingListById({ shoppingId, ...pagination });
        }
        catch (e) {
            Toast.show("Failed")
            console.log(e);
        }
    };
    const saveItemToFridge = async (record: any) => {
        try {
            await addItemToFridge(record);
            if (isAddError) {
                Toast.show("failed to add");
                return;
            }
            Toast.show("Success");
        }
        catch (e) {
            Toast.show("Failed")
        }
        finally {
            await fetchShoppingListById({ shoppingId, ...pagination })
            formAddFridge.resetFields();
            setIsModalVisible(false)
        }
    }

    return (

        <ScrollView style={styles.container}>
            <Text style={styles.title}>Shopping List</Text>
            {!userInfo || isLoading ? (
                <ActivityIndicator size="large" />
            ) : isError ? (
                // <Text style={styles.errorText}>Failed to load data</Text>
                <ScrollView style={styles.centered}>
                    <Text style={styles.errorText}>Failed to load groups. Please try again.</Text>
                    <Button onPress={() => fetchShoppingListById({ shoppingId, ...pagination })}>
                        Retry
                    </Button>
                </ScrollView>
            ) : (
                <Form form={form}>
                    <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}
                    >
                        <Input
                            readOnly
                            value={form.getFieldValue('date')}
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
                    <Form.Item name="name" label="name" rules={[{ required: true, message: "Please select a name" }]}
                    >
                        <Input
                            placeholder={form.getFieldValue('name')}
                            value={form.getFieldValue('name')}
                            defaultValue={form.getFieldValue('name')}
                        />
                    </Form.Item>
                    <ScrollView>
                        {items.map((item, index) => (
                            <ItemRow
                                key={index}
                                index={index}
                                item={item}
                                foods={foods}
                                units={units}
                                users={users}
                                onUpdate={updateItem}
                                onRemove={() => removeItem(index)}
                                setIsModalVisible={setIsModalVisible}
                                setSelectedItem={setSelectedItem}
                                setAction={setAction}
                            />
                        ))}
                        <Button onPress={addItem}>Add Item</Button>
                        <Button onPress={saveShoppingList}>Save Shopping List</Button>
                    </ScrollView>
                </Form>
            )}
            <Modal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            >
                <Modal.Content>
                    {action == 'addToFridge' && selectedItem &&
                        <>
                            <Modal.CloseButton />
                            <Modal.Header>
                                Add Item To The Fridge
                            </Modal.Header>
                            <Modal.Body>
                                <Form form={formAddFridge}>
                                    <FormControl isInvalid={!selectedItem.food}>
                                        <Select
                                            placeholder="Select Food"
                                            selectedValue={selectedItem.food}
                                            isDisabled={true}
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                        >
                                            {foods.map((food) => (
                                                <Select.Item key={food.id} label={food.name} value={food.id} />
                                            ))}
                                        </Select>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            Please select a food item!
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!selectedItem.unit}>
                                        <Select
                                            placeholder="Select Unit"
                                            selectedValue={selectedItem.unit}
                                            isDisabled={true}
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                        >
                                            {units.map((unit) => (
                                                <Select.Item key={unit.id} label={unit.name} value={unit.id} />
                                            ))}
                                        </Select>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            Please select a unit!
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!selectedItem.assignee}>
                                        <Select
                                            placeholder="Select Assignee"
                                            selectedValue={selectedItem.assignee}
                                            isDisabled={true}
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                        >
                                            {users.map((user) => (
                                                <Select.Item key={user.id} label={user.name} value={user.id} />
                                            ))}
                                        </Select>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            Please select an assignee!
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!selectedItem.quantity}>
                                        <Input
                                            type="number"
                                            placeholder="Enter Quantity"
                                            // keyboardType="numeric"
                                            disabled={true}
                                            value={`${selectedItem.quantity}`}
                                        />
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            Please select an assignee!
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <Form.Item name="date" label="Expired Date" rules={[{ required: true, message: "Please select a date" }]}
                                    >
                                        <Input
                                            readOnly
                                            value={formAddFridge.getFieldValue('date')}
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
                                                Toast.show(val.toDateString())
                                                formAddFridge.setFieldValue('date', val)
                                            }}
                                        />
                                    </Form.Item>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                        setIsModalVisible(false);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button onPress={async () => {
                                        setIsModalVisible(false);
                                        const values = await formAddFridge.validateFields();
                                        await saveItemToFridge({
                                            expired_at: values.date,
                                            food_id: selectedItem.food,
                                            unit_id: selectedItem.unit,
                                            quantity: selectedItem.quantity,
                                            group_id: groupId,
                                            shopping_id: selectedItem.id
                                        })
                                    }}>
                                        Save To Fridge
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </>
                    }
                    {action == 'delete' && selectedItem &&
                        <>
                            <Modal.CloseButton />
                            <Modal.Header>
                                Delete Item
                            </Modal.Header>
                            <Modal.Body>
                                <Text>
                                    Are you sure you want to delete this item?
                                </Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                        setIsModalVisible(false);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button onPress={async () => {
                                        await deleteShoppingItemById(selectedItem)
                                    }}>
                                        Delete
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </>}
                </Modal.Content>
            </Modal>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    itemRow: { marginBottom: 16, padding: 10, backgroundColor: "#fff", borderRadius: 8 },
    errorText: { color: "red", textAlign: "center", marginVertical: 10 },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
