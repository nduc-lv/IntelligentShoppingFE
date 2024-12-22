import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import lodash from "lodash";
import { Dropdown } from 'react-native-searchable-dropdown-kj'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Toast, Form, Input } from "@ant-design/react-native";
import { FormControl, Select, WarningOutlineIcon, CheckIcon, Modal, Button, Image } from "native-base";
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
}> = React.memo(({ index, item, foods, units, users, onUpdate, onRemove, setIsModalVisible, setAction, setSelectedItem }) => {
    const [isFocus, setIsFocus] = useState(false);
    const onSaveToFridge = () => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'delete') };
    const onDelete = () => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'delete') }
    return (
        <View style={styles.itemContainer}>
            <Image
                source={{
                    uri: item.id
                        ? "https://wallpaperaccess.com/full/317501.jpg"
                        : "https://wallpaperaccess.com/full/317501.jpg",
                }}
                alt="Image description"
                size={"xl"}
            />
            <View style={{flexGrow: 1}}>
                {!item.id &&
                    <FormControl isInvalid={!item.food}>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={foods.map(item => ({
                                label: item.name,
                                value: item.id
                            }))}
                            search
                            maxHeight={300}
                            placeholder={!isFocus ? 'Select Food' : '...'}
                            labelField="label"
                            valueField="value"
                            searchPlaceholder="Search..."
                            value={item.food}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                onUpdate(index, "food", item.value)
                                setIsFocus(false)
                            }}
                        />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Please select a food item!
                        </FormControl.ErrorMessage>
                    </FormControl>
                }
                {item.id &&

                    <View style={styles.textContainer}>
                        <Text style={styles.itemName}>{lodash.find(foods, food => food.id === item.food)?.name}</Text>
                    </View>
                }
                <Input
                    type="number"
                    placeholder="Enter Quantity"
                    // keyboardType="numeric"
                    value={`${item.quantity}`}
                    onChange={(value) => onUpdate(index, "quantity", Number(value))}
                />
                <FormControl isInvalid={!item.unit}>
                    {/* <Select
                    placeholder="Select Unit"
                    selectedValue={item.unit}
                    onValueChange={(value) => onUpdate(index, "unit", value)}
                    _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                >
                    {units.map((unit) => (
                        <Select.Item key={unit.id} label={unit.name} value={unit.id} />
                        ))}
                        </Select> */}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={units.map(item => ({
                            label: item.name,
                            value: item.id
                        }))}
                        search
                        maxHeight={300}
                        placeholder={!isFocus ? 'Select Unit' : '...'}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Search..."
                        value={item.unit}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            onUpdate(index, "unit", item.value)
                            setIsFocus(false)
                        }}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Please select a unit!
                    </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isInvalid={!item.assignee}>
                    {/* <Select
                    placeholder="Select Assignee"
                    selectedValue={item.assignee}
                    onValueChange={(value) => onUpdate(index, "assignee", value)}
                    _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                >
                    {users.map((user) => (
                        <Select.Item key={user.id} label={user.name} value={user.id} />
                    ))}
                </Select> */}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={users.map(item => ({
                            label: item.name,
                            value: item.id
                        }))}
                        search
                        maxHeight={300}
                        placeholder={!isFocus ? 'Select Asignee' : '...'}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Search..."
                        value={item.assignee}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            onUpdate(index, "assignee", item.value)
                            setIsFocus(false)
                        }}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Please select an assignee!
                    </FormControl.ErrorMessage>
                </FormControl>
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
            </View>

            {/* {item.id && <Button onPress={dele}} */}
            {/* TODO: DELETE ITEM + ADD TO THE FRIDGE + BUILD INFINITYES */}
        </View>
    )
});

// const mockerUserId = '67ecf6e5-c4aa-461f-930f-e03fe0f8f6b2'
export const ShoppingListById: React.FC = () => {
    const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListById">>();
    // const userData = useSelector((state:any) => state?.userApi?.queries[`getMe`]?.data);
    const [date, setDate] = useState(new Date());


    const showDatepicker = () => {
        showMode('date');
    };
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
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        console.log(currentDate)
        setDate(currentDate)
        formAddFridge.setFieldValue("date", moment(currentDate).format("YYYY-MM-DD"))
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
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
                <View style={{ flexGrow: 1 }}>
                    <Form form={form}>
                        {/* <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}
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
                    </Form.Item> */}
                        <View style={{ flex: 1 }}>
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
                        </View>
                    </Form>
                    {/* <TouchableOpacity style={styles.addToCartButton} onPress={addItem}>
                        <Text style={styles.addToCartText}>Add New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addToCartButton} onPress={saveShoppingList}>
                        <Text style={styles.addToCartText}>Save</Text>
                    </TouchableOpacity> */}
                </View>)}
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
                                        <Text>
                                           {moment(date).format("YYYY-DD-MM")}
                                        </Text>
                                    </Form.Item>
                                    <Button onPress={() => showDatepicker()}>
                                        Choose Date
                                    </Button>
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
            <TouchableOpacity style={styles.addToCartButton} onPress={addItem}>
                <Text style={styles.addToCartText}>Add New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCartButton} onPress={saveShoppingList}>
                <Text style={styles.addToCartText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
        display: 'flex',
        flexDirection: "column"
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    list: {
        marginBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textContainer: {
        padding: 10,
        flex: 1,
    },
    itemName: {
        fontSize: 25,
        fontWeight: "bold"
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        borderRadius: 15,
    },
    buttonText: {
        fontSize: 20,
        color: '#333',
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 20,
    },
    addToCartButton: {
        backgroundColor: '#00b894',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20
    },
    addToCartText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    itemRow: { marginBottom: 16, padding: 10, backgroundColor: "#fff", borderRadius: 8 },
    errorText: { color: "red", textAlign: "center", marginVertical: 10 },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
