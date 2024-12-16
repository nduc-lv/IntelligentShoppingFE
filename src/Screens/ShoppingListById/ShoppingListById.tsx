import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Toast, DatePicker, Input } from "antd-mobile";
import { FormControl, Select, WarningOutlineIcon, CheckIcon, Modal, Button} from "native-base";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
    useLazyGetItemByShoppingListIdQuery,
    useDeleteShoppingListMutation,
    useCreateShoppingListMutation,
    useUpdateShoppingListMutation,
    useLazyGetAllUnitQuery,
    useLazyGetAllFoodQuery,
    useLazyGetAllUserQuery,
} from "@/Services/shoppingList";

type ShoppingListRouteParams = {
    ShoppingListById: { shoppingId: string; groupId: string };
};

type Item = {
    food: string;
    unit: string;
    assignee: string;
    quantity: number;
    [key:string]: string | number
};

const ItemRow: React.FC<{
    index: number;
    item: Item;
    foods: Array<{ id: string; name: string }>;
    units: Array<{ id: string; name: string }>;
    users: Array<{ id: string; name: string }>;
    onUpdate: (index: number, key: string, value: string | number) => void;
    onRemove: () => void;
}> = React.memo(({ index, item, foods, units, users, onUpdate, onRemove }) => (
    <View style={styles.itemRow}>
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

        <Button onPress={onRemove} colorScheme="danger" size="sm">
            Remove
        </Button>
    </View>
));

const mockerUserId = '84ef5319-acef-4d19-b048-fdf00ff3e386'
export const ShoppingListById: React.FC = () => {
    const route = useRoute<RouteProp<ShoppingListRouteParams, "ShoppingListById">>();
    const { groupId, shoppingId } = route.params;
    const [pagination, setPagination] = useState({ page: 1, per: 10 });
    const [fetchShoppingListById, { data: rows = [], isLoading, isError }] = useLazyGetItemByShoppingListIdQuery();
    const [deleteShoppingList] = useDeleteShoppingListMutation();
    const [updateShoppingList] = useUpdateShoppingListMutation();
    const [createShoppingList] = useCreateShoppingListMutation();
    const [fetchUnitList, { data: units = [] }] = useLazyGetAllUnitQuery();
    const [fetchFoodList, { data: foods = [] }] = useLazyGetAllFoodQuery();
    const [fetchUserList, { data: users = [] }] = useLazyGetAllUserQuery();

    const [items, setItems] = useState<Item[]>([{ food: "", unit: "", assignee: "", quantity: 0 }]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        fetchShoppingListById({ shoppingId, ...pagination});
        fetchFoodList({ userId: mockerUserId });
        fetchUnitList({ userId: mockerUserId });
        fetchUserList({ groupId});
    }, [groupId, shoppingId, fetchShoppingListById, fetchFoodList, fetchUnitList, fetchUserList]);

    useEffect(() => {
        if (rows && rows.length > 0) {
            const updatedItems = rows.map((row) => ({
                food: row.food_id || "", 
                unit: row.unit_id || "", 
                assignee: row.task.user_id || "", 
                quantity: row.quantity || 0,
            }));
            setItems(updatedItems);
        }
    }, [rows]);

    const addItem = () => setItems([...items, { food: "", unit: "", assignee: "", quantity: 0 }]);
    const updateItem = (index: number, key: string, value: string | number) => {
        const updatedItems = [...items];
        updatedItems[index][key] = value;
        setItems(updatedItems);
    };
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const saveShoppingList = async () => {
        // Validation and save logic
        // fix backend so that it can save as well as create new 
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
                <Button onPress={() => fetchShoppingListById({shoppingId, ...pagination})}>
                  Retry
                </Button>
              </View>
            ) : (
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
                        />
                    ))}
                    <Button onPress={addItem}>Add Item</Button>
                    <Button onPress={saveShoppingList}>Save Shopping List</Button>
                </ScrollView>
            )}
        </View>
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
