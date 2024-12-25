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
}> = React.memo(({ index, item, foods, units, users, onUpdate, onRemove }) => (
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
        <Button>
            Delete
        </Button>}
        {/* {item.id && <Button onPress={dele}} */}
        {/* TODO: DELETE ITEM + ADD TO THE FRIDGE + BUILD INFINITYES */}
    </ScrollView>
));

// const mockerUserId = '67ecf6e5-c4aa-461f-930f-e03fe0f8f6b2'
export const addToFridgeForm: React.FC<{
    item: Item;
    onUpdate: (index: number, key: string, value: string | number) => void;
    onRemove: () => void;
}> = React.memo(({ index, item, foods, units, users, onUpdate, onRemove }) => {


})

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
