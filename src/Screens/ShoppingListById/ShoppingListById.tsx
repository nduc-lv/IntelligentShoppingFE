import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Check, Calendar } from "lucide-react-native";
import { Plus } from "lucide-react-native";
import moment from "moment";
import lodash from "lodash";
import { Dropdown } from "react-native-searchable-dropdown-kj";
import { useSelector } from "react-redux";
import { selectUser } from "@/Store/reducers";
import {
	DateTimePickerAndroid,
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	ScrollView,
	TextInput,
	TouchableHighlight,
} from "react-native";
import { SwipeRow } from "react-native-swipe-list-view";
import { Toast, Form, Input } from "@ant-design/react-native";
import {
	FormControl,
	Select,
	WarningOutlineIcon,
	CheckIcon,
	Modal,
	Button,
	Image,
	FlatList,
} from "native-base";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
	useLazyGetItemByShoppingListIdQuery,
	useUpdateShoppingListMutation,
	useLazyGetAllUnitQuery,
	useLazyGetAllFoodQuery,
	useLazyGetAllUserQuery,
	useAddShoppingItemToFridgeMutation,
	useDeleteShoppingItemByIdMutation,
} from "@/Services/shoppingList";

import { useFocus } from "native-base/lib/typescript/components/primitives";
import { Unit } from "@/Services/unit";

type ShoppingListRouteParams = {
	ShoppingListById: { shoppingId: string; groupId: string };
};

type Item = {
	id: string;
	food: string;
	unit: string;
	assignee: string;
	quantity: number;
	[key: string]: string | number | undefined;
};

// const ItemRow: React.FC<{
//     index: number;
//     item: Item;
//     foods: Array<{ id: string; name: string }>;
//     units: Array<{ id: string; name: string }>;
//     users: Array<{ id: string; name: string }>;
//     onUpdate: (index: number, key: string, value: string | number) => void;
//     onRemove: () => void;
//     setAction: any;
//     setIsModalVisible: any;
//     setSelectedItem: any;
// }> = React.memo(({ index, item, foods, units, users, onUpdate, onRemove, setIsModalVisible, setAction, setSelectedItem }) => {
//     const [isFocus, setIsFocus] = useState(false);
//     const onSaveToFridge = () => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'delete') };
//     const onDelete = () => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'delete') }
//     return (
//         <SwipeRow
//             leftOpenValue={70}
//         >
//             <TouchableOpacity style={styles.deleteButton} onPress={() => {
//                 if (item.id) {
//                     setIsModalVisible(true);
//                     setSelectedItem(curr => item);
//                     setAction(curr => 'delete')
//                 }
//                 else {
//                     onRemove()
//                 }
//             }}>
//                 <Trash2></Trash2>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.itemContainer} onPress={() => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'edit') }}>
//                 <Image
//                     source={{
//                         uri: item.id
//                             ? "https://wallpaperaccess.com/full/317501.jpg"
//                             : "https://wallpaperaccess.com/full/317501.jpg",
//                     }}
//                     alt="Image description"
//                     size={"xl"}
//                 />
//                 <View style={{ flexGrow: 1 }}>
//                     <FormControl>
//                         {!item.id &&
//                             <FormControl>
//                                 <Dropdown
//                                     style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
//                                     placeholderStyle={styles.placeholderStyle}
//                                     selectedTextStyle={styles.selectedTextStyle}
//                                     inputSearchStyle={styles.inputSearchStyle}
//                                     iconStyle={styles.iconStyle}
//                                     data={foods.map(item => ({
//                                         label: item.name,
//                                         value: item.id
//                                     }))}
//                                     search
//                                     maxHeight={300}
//                                     placeholder={!isFocus ? 'Select Food' : '...'}
//                                     labelField="label"
//                                     valueField="value"
//                                     searchPlaceholder="Search..."
//                                     value={item.food}
//                                     onFocus={() => setIsFocus(true)}
//                                     onBlur={() => setIsFocus(false)}
//                                     onChange={item => {
//                                         onUpdate(index, "food", item.value)
//                                         setIsFocus(false)
//                                     }}
//                                 />
//                                 <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
//                                     Please select a food item!
//                                 </FormControl.ErrorMessage>
//                             </FormControl>
//                         }
//                         {item.id &&

//                             <View style={styles.textContainer}>
//                                 <Text style={styles.itemName}>{lodash.find(foods, food => food.id === item.food)?.name}</Text>
//                             </View>
//                         }
//                         <View style={{ display: 'flex', flexDirection: 'row' }}>
//                             <Input
//                                 type="number"
//                                 placeholder="Enter Quantity"
//                                 // keyboardType="numeric"
//                                 value={`${item.quantity}`}
//                                 style={{ paddingLeft: 10 }}
//                                 onChangeText={(value) => { onUpdate(index, "quantity", Number(value)) }}
//                             />
//                             <FormControl>
//                                 <Dropdown
//                                     style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
//                                     placeholderStyle={styles.placeholderStyle}
//                                     selectedTextStyle={styles.selectedTextStyle}
//                                     inputSearchStyle={styles.inputSearchStyle}
//                                     iconStyle={styles.iconStyle}
//                                     data={units.map(item => ({
//                                         label: item.name,
//                                         value: item.id
//                                     }))}
//                                     search
//                                     maxHeight={300}
//                                     placeholder={!isFocus ? 'Select Unit' : '...'}
//                                     labelField="label"
//                                     valueField="value"
//                                     searchPlaceholder="Search..."
//                                     value={item.unit}
//                                     onFocus={() => setIsFocus(true)}
//                                     onBlur={() => setIsFocus(false)}
//                                     onChange={item => {
//                                         onUpdate(index, "unit", item.value)
//                                         setIsFocus(false)
//                                     }}
//                                 />
//                                 <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
//                                     Please select a unit!
//                                 </FormControl.ErrorMessage>
//                             </FormControl>
//                         </View>
//                         <FormControl>
//                             {/* <Select
//                         placeholder="Select Assignee"
//                         selectedValue={item.assignee}
//                         onValueChange={(value) => onUpdate(index, "assignee", value)}
//                         _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
//                     >
//                         {users.map((user) => (
//                             <Select.Item key={user.id} label={user.name} value={user.id} />
//                         ))}
//                     </Select> */}
//                             <Dropdown
//                                 style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
//                                 placeholderStyle={styles.placeholderStyle}
//                                 selectedTextStyle={styles.selectedTextStyle}
//                                 inputSearchStyle={styles.inputSearchStyle}
//                                 iconStyle={styles.iconStyle}
//                                 data={users.map(item => ({
//                                     label: item.name,
//                                     value: item.id
//                                 }))}
//                                 search
//                                 maxHeight={300}
//                                 placeholder={!isFocus ? 'Select Asignee' : '...'}
//                                 labelField="label"
//                                 valueField="value"
//                                 searchPlaceholder="Search..."
//                                 value={item.assignee}
//                                 onFocus={() => setIsFocus(true)}
//                                 onBlur={() => setIsFocus(false)}
//                                 onChange={item => {
//                                     onUpdate(index, "assignee", item.value)
//                                     setIsFocus(false)
//                                 }}
//                             />
//                             <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
//                                 Please select an assignee!
//                             </FormControl.ErrorMessage>
//                         </FormControl>

//                         {/* {!item.id && <Button onPress={onRemove} colorScheme="danger" size="sm">
//                         Remove
//                         </Button>}
//                         {item.id &&
//                         <Button onPress={() => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'delete') }}>
//                             Delete
//                             </Button>
//                             }
//                     {
//                         item.id &&
//                         <Button onPress={() => { setIsModalVisible(true); setSelectedItem(curr => item); setAction(curr => 'addToFridge') }}>
//                         Save To Fridge
//                         </Button>
//                         } */}
//                     </FormControl>
//                 </View>

//                 {/* {item.id && <Button onPress={dele}} */}
//                 {/* TODO: DELETE ITEM + ADD TO THE FRIDGE + BUILD INFINITYES */}
//             </TouchableOpacity>
//         </SwipeRow>
//     )
// });

// const mockerUserId = '67ecf6e5-c4aa-461f-930f-e03fe0f8f6b2'
export const ShoppingListById: React.FC = () => {
	const route =
		useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListById">>();
	// const userData = useSelector((state:any) => state?.userApi?.queries[`getMe`]?.data);
	const [date, setDate] = useState(new Date());

    const showDatepicker = () => {
        showMode('date');
    };
    const [formDate, setFormDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const { groupId, shoppingId } = route.params;
    const [pagination, setPagination] = useState({ page: 1, per: 10 });
    const [selectedItem, setSelectedItem] = useState<Item>();
    const [fetchShoppingListById, { data: shoppingList = {rows: [], isAdmin: false}, isLoading, isError }] = useLazyGetItemByShoppingListIdQuery();
    const [updateShoppingList, { isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateShoppingListMutation();
    const [addItemToFridge, { isError: isAddError }] = useAddShoppingItemToFridgeMutation();
    const [deleteShoppingItem, { isError: isDeleteError }] = useDeleteShoppingItemByIdMutation();
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const user = useSelector(selectUser)
    const [fetchUnitList, { data: units = [] }] = useLazyGetAllUnitQuery();
    const [fetchFoodList, { data: foods = [] }] = useLazyGetAllFoodQuery();
    const [fetchUserList, { data: users = [] }] = useLazyGetAllUserQuery();
    const [formAddFridge] = Form.useForm();
    formAddFridge.setFieldValue("date", new Date())
    const [items, setItems] = useState<Item[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleDisplayNameFromId = (data: Array<any>, obj: { id: string }) => {
        const result = lodash.find(data, obj);
        console.log(result);
        return result?.name
    }
    const deleteShoppingItemById = async (item: Item) => {
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
    const refresh = async () => {
        await fetchShoppingListById({shoppingId, ...pagination});
        console.log(shoppingList.rows)
    }
    useEffect(() => {
        fetchShoppingListById({ shoppingId, ...pagination });
        fetchFoodList({});
        fetchUnitList({});
        fetchUserList({ groupId });
    }, []);
    // useEffect(() => {
    //     if (shoppingList.rows && shoppingList.rows.length >= 0) {
    //         const updatedItems = shoppingList.rows.map((row, index) => {
    //             if (index == 0) {
    //                 form.setFieldValue('date', row.shopping.date);
    //                 form.setFieldValue('name', row.shopping.name)
    //             }
    //             return ({
    //                 id: row.id,
    //                 food: row.food_id || "",
    //                 unit: row.unit_name || "",
    //                 assignee: row.task.user_id || "",
    //                 quantity: row.quantity || 0,
    //             })
    //         });
    //         setItems((prev) => [...updatedItems]);
    //     }
    // }, [reload]);
    const [action, setAction] = useState<"addToFridge" | "delete" | "edit" | 'create' | null>(null);
    const showEditModal = (item: Item) => {
        editForm.setFieldsValue(item)
        setSelectedItem(item);
        setAction("edit");
        setIsModalVisible(true);
    }
    const handleEditItem = async () => {
        try {
            const values = await editForm.validateFields();
            const payload = {
                groupId: groupId,
                foods: [
                    {
                        id: selectedItem?.id,
                        food_id: values.food,
                        quantity: values.quantity,
                        user_id: values.assignee,
                        unit_name: values.unit
                    }
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
            setIsModalVisible(false);
            editForm.resetFields();
            // await fetchShoppingListById({ shoppingId, ...pagination });
            await refresh()
        }
        catch (e) {
            Toast.show("Failed")
        }
    }
    const handleCreateItem = async () => {
        try {
            const values = await createForm.validateFields();
            const payload = {
                groupId: groupId,
                foods: [
                    {
                        food_id: values.food,
                        quantity: values.quantity,
                        user_id: values.assignee,
                        unit_name: values.unit
                    }
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
            setIsModalVisible(false)
            createForm.resetFields();
            // await fetchShoppingListById({ shoppingId, ...pagination });
            await refresh();
        }
        catch (e) {
            Toast.show("Failed")
        }
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        console.log(currentDate)
        setFormDate(moment(currentDate).format("YYYY-MM-DD"))
        formAddFridge.setFieldValue("date", moment(currentDate).format("YYYY-MM-DD"))
    };


    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            minimumDate: new Date(),
            is24Hour: true,
        });
    };

	const showCreateModal = () => {
		setAction("create");
		setIsModalVisible(true);
	};
	const saveItemToFridge = async (record: any) => {
		try {
			await addItemToFridge(record);
			if (isAddError) {
				Toast.show("failed to add");
				return;
			}
			Toast.show("Success");
		} catch (e) {
			Toast.show("Failed");
		} finally {
			// await fetchShoppingListById({ shoppingId, ...pagination });
            await refresh()
			formAddFridge.resetFields();
            setFormDate(moment(new Date()).format("YYYY-MM-DD"))
			setIsModalVisible(false);
		}
	};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shopping List</Text>
            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : isError ? (
                // <Text style={styles.errorText}>Failed to load data</Text>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Failed to load groups. Please try again.</Text>
                    <Button onPress={() => refresh()}>
                        Retry
                    </Button>
                </View>
            ) :
                (
                    <>

                        {/* <TouchableOpacity style={styles.addToCartButton} onPress={showCreateModal}>
                        <Text style={styles.addToCartText}>Add New</Text>
                    </TouchableOpacity> */}
					{/* <Form form={form}>
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
                    </Form> */}
                        {users && foods && units && shoppingList.rows && !shoppingList.rows.length
                            &&
                            <View>
                                <Text>
                                    Your list is empty
                                </Text>
                            </View>
                        }
                        <FlatList
                            data={shoppingList?.rows?.map(row => ({
                                id: row.id,
                                food: row.food_id || "",
                                unit: row.unit_name || "",
                                assignee: row.task.user_id || "",
                                quantity: row.quantity || 0,
                            }))}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <SwipeRow
                                        rightOpenValue={-150}
                                    >
                                        <View style={styles.rowBack}>
                                            <TouchableOpacity
                                                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                                                onPress={() => {
                                                    setIsModalVisible(true);
                                                    setSelectedItem(curr => item);
                                                    setAction(curr => 'addToFridge')
                                                }}
                                            >
                                                <Check color={"white"}></Check>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                                onPress={() => {
                                                    setIsModalVisible(true);
                                                    setSelectedItem(curr => item);
                                                    setAction(curr => 'delete')
                                                }}
                                            >
                                                <Trash2 color={'white'}></Trash2>
                                            </TouchableOpacity>
                                        </View>
                                        {/* <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                            setIsModalVisible(true);
                                            setSelectedItem(curr => item);
                                            setAction(curr => 'delete')
                                        }}>
                                            <Trash2></Trash2>
                                        </TouchableOpacity> */}
                                        <TouchableHighlight onPress={() => { shoppingList.isAdmin && showEditModal(item) }}>
                                            <View style={styles.itemContainer} >

                                                <Image
                                                    source={{
                                                        uri: item?.image_url || 'https://wallpaperaccess.com/full/4901583.jpg'
                                                    }}
                                                    alt="Image description"
                                                    size={"xl"}
                                                    borderRadius={10}
                                                />
                                                <View style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ fontWeight: "bold" }}>
                                                        {handleDisplayNameFromId(foods, {
                                                            id: item.food
                                                        })}
                                                    </Text>
                                                    <View style={{ flexDirection: "row", margin: 10, justifyContent: "space-between", gap: 5 }}>
                                                        <Text>
                                                            {item.quantity}
                                                        </Text>
                                                        <Text ellipsizeMode="clip" numberOfLines={1}>
                                                            {item.unit}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    </SwipeRow>
                                )
                            }}
                        >
                        </FlatList>
                    </>
                )}

            {
                shoppingList.isAdmin &&
                <TouchableOpacity style={styles.fab} onPress={showCreateModal}>
                    <Plus color="white" size={25} />
                </TouchableOpacity>
            }
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
                                <Form form={formAddFridge} style={{ gap: 5 }}>
                                    <View style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={[{ width: "100%", textAlign: "center" }, styles.inputNumber]}>
                                            {handleDisplayNameFromId(foods, {
                                                id: selectedItem.food
                                            })}
                                        </Text>
                                        <View style={[{ width: "100%", flexDirection: "row", margin: 10, justifyContent: "center", gap: 10, }, styles.inputNumber]}>
                                            <Text style={{ fontSize: 18 }}>
                                                {selectedItem.quantity}
                                            </Text>
                                            <Text ellipsizeMode="clip" numberOfLines={1} style={{ fontSize: 18 }}>
                                                {selectedItem.unit}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[styles.inputNumber, { width: "100%", textAlign: "center" }]}
                                        >
                                            {handleDisplayNameFromId(users, {
                                                id: selectedItem.assignee
                                            })}
                                        </Text>
                                    </View>
                                    {/* <FormControl isInvalid={!selectedItem.quantity}>
                                        <Input
                                            type="number"
                                            placeholder="Enter Quantity"
                                            // keyboardType="numeric"
                                            disabled={true}
                                            value={`${selectedItem.quantity}`}
                                        />
                                    </FormControl> */}
                                    {/* <FormControl isInvalid={!selectedItem.unit}>
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
                                    </FormControl> */}

                                    {/* <FormControl isInvalid={!selectedItem.assignee}>
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
                                    </FormControl> */}

                                    <Form.Item name="date" style={[{ paddingLeft: 0 }]} rules={[{ required: true, message: "Please select a date" }]}
                                    >
                                        {/* <Text>
                                            {moment(form.getFieldValue("date")).format("YYYY-DD-MM")}
                                        </Text> */}

                                        <Text style={{ marginTop: 10, marginBottom: 10 }}>
                                            Expired Date
                                        </Text>
                                        <TouchableOpacity onPress={() => showDatepicker()} style={{ display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={{ fontSize: 20 }}>
                                                {formDate}
                                            </Text>
                                            <Calendar />
                                        </TouchableOpacity>
                                    </Form.Item>
                                    {/* <Button onPress={() => showDatepicker()}>
                                        Choose Date
                                    </Button> */}
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
                                            exprire_date: values.date,
                                            food_id: selectedItem.food,
                                            unit_name: selectedItem.unit,
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
                    {action == 'edit' && selectedItem &&
                        <>
                            <Modal.CloseButton />
                            <Modal.Header>
                                Edit
                            </Modal.Header>
                            <Modal.Body>
                                <Form form={editForm}>
                                    <Form.Item name={'food'} rules={[{ required: true, message: "Must not Empty" }]}>
                                        {/* <Select
                                            placeholder="Select Food"
                                            defaultValue={selectedItem.food}
                                            // selectedValue={editForm.getFieldValue('food') || selectedItem.food}
                                            onValueChange={(value) => {
                                                editForm.setFieldValue('food', value)
                                            }}
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                        >
                                            {foods.map((food) => (
                                                <Select.Item key={food.id} label={food.name} value={food.id} />
                                            ))}
                                        </Select> */}
                                        <Dropdown
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={foods.map(item => ({
                                                label: item.name,
                                                value: item.id
                                            }))}
                                            search
                                            placeholder={handleDisplayNameFromId(foods, {id: selectedItem.food})}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            searchPlaceholder="Search..."
                                            onChange={item => {
                                                editForm.setFieldValue('food', item.value)
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item name={'quantity'} rules={[{ required: true, message: 'Must not empty' }]}>
                                        {/* <Input
                                            type="number"
                                            placeholder="Enter Quantity"
                                            defaultValue={`${selectedItem.quantity}`}
                                            // keyboardType="numeric"
                                            // value={createForm.getFieldValue('quantity') || selectedItem.quantity}
                                            onChangeText={(text) => {
                                                if (text) {
                                                    createForm.setFieldValue('quantity', Number(text))
                                                }
                                            }}
                                        /> */}
                                        <TextInput
                                            style={styles.inputNumber}
                                            onChangeText={(text) => {
                                                if (text) {
                                                    editForm.setFieldValue('quantity', Number(text))
                                                }
                                            }}
                                            defaultValue={`${selectedItem.quantity}`}
                                            keyboardType="numeric"
                                            placeholder="Enter number"
                                            placeholderTextColor="#999"
                                        />
                                    </Form.Item>
                                    <Form.Item name={'unit'} rules={[{ required: true, message: 'Must not empty' }]}>
                                        {/* <Select
                                            placeholder="Select Unit"
                                            defaultValue={selectedItem.unit}
                                            onValueChange={(itemVlue) => editForm.setFieldValue("unit", itemVlue)}
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                        >
                                            {units.map((unit) => (
                                                <Select.Item key={unit.id} label={unit.name} value={unit.id} />
                                            ))}
                                        </Select> */}
                                        <TextInput
                                            style={styles.inputNumber}
                                            defaultValue={`${selectedItem.unit}`}
                                            onChangeText={(value) => editForm.setFieldValue('unit', value)}
                                            placeholder="Enter a unit"
                                            placeholderTextColor="#999"
                                        />
                                        {/* <View style={styles.inputSearchStyle}>
                                            {/* <Autocomplete
                                                data={units.map(item => item.name)}
                                                value={form.getFieldValue("unit")}
                                                onChangeText={(value) => createForm.setFieldValue('unit', value)}
                                                flatListProps={{
                                                    keyExtractor: (_, idx) => `${idx}`,
                                                    renderItem: ({ item }: { item: string }) => <Text>{item}</Text>,
                                                }}
                                            /> */}



                                    </Form.Item>

                                    <Form.Item name={'assignee'} rules={[{ required: true, message: "Must not empty" }]}>
                                        {/* <Select
                                            placeholder="Select Assignee"
                                            defaultValue={selectedItem.assignee}
                                            onValueChange={(itemValue) => {
                                                editForm.setFieldValue("assignee", itemValue)
                                            }}
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                        >
                                            {users.map((user) => (
                                                <Select.Item key={user.id} label={user.name} value={user.id} />
                                            ))}
                                        </Select> */}
                                         <Dropdown
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={users.map(item => ({
                                                label: item.name,
                                                value: item.id
                                            }))}
                                            search
                                            placeholder={handleDisplayNameFromId(users, {id: selectedItem.assignee})}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            searchPlaceholder="Search..."
                                            onChange={item => {
                                                editForm.setFieldValue('assignee', item.value)
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
                                    <Button onPress={handleEditItem}>
                                        Save Item
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </>
                    }
                    {action == 'create' &&
                        <>
                            <Modal.CloseButton />
                            <Modal.Header>
                                Add Item
                            </Modal.Header>
                            <Modal.Body>
                                <Form form={createForm}>
                                    <Form.Item name={'food'} rules={[{ required: true, message: "Must not Empty" }]}>
                                        {/* <Select
                                            placeholder="Select Food"
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                            onValueChange={(itemValue) => createForm.setFieldValue('food', itemValue)}
                                        >
                                            {foods.map((food) => (
                                                <Select.Item key={food.id} label={food.name} value={food.id} />
                                            ))}
                                        </Select> */}
                                        <Dropdown
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={foods.map(item => ({
                                                label: item.name,
                                                value: item.id
                                            }))}
                                            search
                                            placeholder="Choose Food"
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            searchPlaceholder="Search..."
                                            onChange={item => {
                                                createForm.setFieldValue('food', item.value)
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item name={'quantity'} rules={[{ required: true, message: 'Must not empty' }]}>
                                        {/* <Input
                                            type="number"
                                            placeholder="Enter Quantity"
                                            onChangeText={(value) => {
                                                if (value) {
                                                    createForm.setFieldValue('quantity', Number(value))
                                                }
                                            }}
                                            keyboardType="numeric"
                                        /> */}
                                       <TextInput
                                            style={styles.inputNumber}
                                            onChangeText={(text) => {
                                                if (text) {
                                                    createForm.setFieldValue('quantity', Number(text))
                                                }
                                            }}
                                            keyboardType="numeric"
                                            placeholder="Enter number"
                                            placeholderTextColor="#999"
                                        />
                                    </Form.Item>
                                    <Form.Item name={'unit'} rules={[{ required: true, message: 'Must not empty' }]}>
                                        {/* <Select
                                            placeholder="Select Unit"
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                            onValueChange={(value) => createForm.setFieldValue('unit', value)}
                                        >
                                            {units.map((unit) => (
                                                <Select.Item key={unit.id} label={unit.name} value={unit.id} />
                                            ))}
                                        </Select> */}
                                        <TextInput
                                            style={styles.inputNumber}
                                            onChangeText={(value) => createForm.setFieldValue('unit', value)}
                                            placeholder="Enter a unit"
                                            placeholderTextColor="#999"
                                        />
                                    </Form.Item>
                                    {/* <View style={styles.autocompleteContainer}>
                                        {/* <Autocomplete
                                            // data={units.map(item => item.name)}
                                            value={form.getFieldValue("unit")}
                                            onChangeText={(value) => createForm.setFieldValue('unit', value)}
                                            flatListProps={{
                                                keyExtractor: (_, idx) => `${idx}`,
                                                renderItem: ({ item }: { item: string }) => <Text>{item}</Text>,
                                            }}
                                        /> */}
                                    {/* <TextInput
                                            onChangeText={(value) => createForm.setFieldValue('unit', value)}
                                        >
                                        </TextInput>
                                    </View> */}


                                    <Form.Item name={'assignee'} rules={[{ required: true, message: "Must not empty" }]}>
                                        {/* <Select
                                            placeholder="Select Assignee"
                                            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                                            onValueChange={(value) => createForm.setFieldValue('assignee', value)}
                                        >
                                            {users.map((user) => (
                                                <Select.Item key={user.id} label={user.name} value={user.id} />
                                            ))}
                                        </Select> */}
                                        <Dropdown
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={users.map(item => ({
                                                label: item.name,
                                                value: item.id
                                            }))}
                                            search
                                            placeholder="Choose Assignee"
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            searchPlaceholder="Search..."
                                            onChange={item => {
                                                createForm.setFieldValue('assignee', item.value)
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
                                    <Button isLoading={isUpdateLoading} onPress={handleCreateItem}>
                                        Save Item
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </>

                    }
                </Modal.Content>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
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
    deleteButton: {
        padding: 12,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'red',
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputNumber: {
        // borderWidth: 2,
        // borderColor: "#3498db",
        // borderRadius: 10,
        paddingVertical: 10,
        // paddingHorizontal: 20,
        fontSize: 18,
        color: "#333",
        backgroundColor: "#fff",
    },
    expiredDate: {
        borderWidth: 2,
        borderColor: "#3498db",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 18,
        color: "#333",
        backgroundColor: "#fff",
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        borderRadius: 8,
        right: 0,
    },
    autocompleteContainer: {
        // flex: 1,
        // left: 0,
        // position: 'absolute',
        // right: 0,
        // top: 0,
        // zIndex: 1
        // position: 'absolute'
    }
});
