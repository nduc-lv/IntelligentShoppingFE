import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import {
    Toast,
} from "antd-mobile";
import { Food, useCreateFoodMutation, useDeleteFoodMutation, useLazyGetAllFoodQuery, useUpdateFoodMutation } from "@/Services/food";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react-native";
import { RootScreens } from "..";
import { Category } from "@/Services/food";
import { useLazyGetAllCategoryQuery } from "@/Services/category";
import SearchableDropdown from "@/General/Components/SearchableDropdown";
import { Actionsheet, Avatar, Input } from "native-base";
import AppData from "@/General/Constants/AppData";

export const ManageFoodScreen = () => {
    const [fetchFood, { data: foodData, isLoading: isFoodLoading, isError: isFoodError }] = useLazyGetAllFoodQuery();
    const [fetchCategory, { data: categoryData, isLoading: isCategoryLoading, isError: isCategoryError }] = useLazyGetAllCategoryQuery();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOption, setModalOption] = useState('');
    const [newFoodName, setNewFoodName] = useState('');
    const [newCategory, setNewCategory] = useState<string>('');
    const [selectedFood, setSelectedFood] = useState<Food | null>();
    const [createFood] = useCreateFoodMutation();
    const [updateFood] = useUpdateFoodMutation();
    const [deleteFood] = useDeleteFoodMutation();
    var filteredFood: Food[] = [];

    const handleSearch = (text: any) => {
        setSearchQuery(text);
    };

    const handleOpenDialog = (option: string, item: Food | null = null) => {
        setModalOption(option);
        if (item) {
            setNewFoodName(item.name);
            setNewCategory(item.category.id);
        }
        setSelectedFood(item);
    };

    const handleCloseDialog = () => {
        setModalOption('');
        setNewFoodName('');
        setNewCategory('');
        setSelectedFood(null);
    };

    const handleSubmit = async () => {
        try {
            if (!newFoodName) {
                Toast.show({ content: "Hãy điền tên mới cho thực phẩm", icon: "fail" });
                return;
            }
            const payload = {
                name: newFoodName,
                category_id: newCategory
            };
            if (modalOption === 'create') {
                await createFood(payload).unwrap();
            }
            if (modalOption === 'edit') {
                if (!selectedFood) {
                    Toast.show({ content: "Hãy chọn thực phẩm", icon: "fail" });
                    return;
                }
                await updateFood({ id: selectedFood.id, ...payload }).unwrap();
            }
            Toast.show({ content: "Unit saved successfully!", icon: "success" });
            fetchFood();
            handleCloseDialog();
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to save unit infomation.", icon: "fail" });
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteFood(id);
            Toast.show({ content: "Unit deleted successfully!", icon: "success" });
            fetchFood();
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to delete group.", icon: "fail" });
        }
    }

    useEffect(() => {
        fetchFood();
        fetchCategory();
    }, [fetchFood, fetchCategory]);

    if (foodData) {
        filteredFood = foodData.filter(
            (data) =>
                data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data.category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const categoryOptions = categoryData && categoryData.map((category) => ({
        label: category.name,  // Dùng name làm label
        value: category.id,    // Dùng id làm value
    }));


    const renderFoodItem = (item: Food) => (
        <View style={styles.foodItem}>
            <Image
                source={{ uri: item.image_url ?? "https://via.placeholder.com/150" }}
                style={styles.avatar}
                defaultSource={{ uri: "https://via.placeholder.com/150" }}
            />
            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodCategory}>{item.category.name}</Text>
            </View>
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => handleOpenDialog('edit', item)}>
                    <Edit size={20} color={AppData.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Trash size={20} color="#F44336" style={{ marginLeft: 16 }} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {isFoodLoading ? (
                <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
            ) : isFoodError ? (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootScreens.ADMIN)}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load food.</Text>
                    </View>
                </View>
            ) : foodData ? (
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate(RootScreens.ADMIN)}>
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{"Quản lý thực phẩm"}</Text>
                    </View>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Tìm kiếm thực phẩm..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={filteredFood}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderFoodItem(item)}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            ) : (
                <Text>No info found.</Text>
            )}
            <TouchableOpacity style={styles.fab} onPress={() => handleOpenDialog('create')}>
                <Plus color="white" size={25} />
            </TouchableOpacity>
            <Actionsheet isOpen={modalOption === 'create' || modalOption === 'edit'}
                onClose={() => handleCloseDialog()}
                hideDragIndicator

            >
                <Actionsheet.Content borderTopRadius={24}                >
                    <View style={{
                        height: 500,
                        padding: 24,
                        gap: 16
                    }}>
                        <View style={{ width: "100%", zIndex: 4 }}>
                            <Image
                                source={{ uri: selectedFood?.image_url || 'https://via.placeholder.com/150' }}
                                style={styles.foodImage}
                            />
                        </View>
                        <View style={{ width: "100%", zIndex: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                            <Input
                                width={"100%"}
                                placeholder="Tên thực phẩm"
                                size={"xl"}
                                height={12}
                                bgColor="white"
                                borderRadius={10}
                                borderColor={AppData.colors.text[400]}
                                borderWidth={0.3}
                                _focus={{
                                    borderColor: AppData.colors.primary,
                                    backgroundColor: "white",
                                }}
                                value={newFoodName}
                                onChangeText={setNewFoodName}
                            />
                        </View>
                        <View style={{ width: "100%", zIndex: 5 }}>
                            <SearchableDropdown
                                options={categoryOptions || []}
                                placeholder="Phân loại"
                                onSelect={(value) => setNewCategory(value)}
                                dropdownWidth="250px"
                            />
                        </View>
                        <TouchableOpacity style={{
                            padding: 16,
                            height: 60,
                            alignSelf: 'center',
                            backgroundColor: AppData.colors.primary,
                            borderRadius: 16,
                            alignItems: 'center',
                            zIndex: 1,
                            minWidth: 200
                        }}
                            onPress={() => handleSubmit()}
                        >
                            <Text style={{
                                fontSize: AppData.fontSizes.medium,
                                fontWeight: "500",
                                color: AppData.colors.text[100],
                            }}>
                                {modalOption === 'edit' ? 'Lưu' : 'Tạo mới'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Actionsheet.Content>
            </Actionsheet>
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    title: {
        flex: 1,
        marginLeft: 8,
        fontSize: 20,
        fontWeight: "bold",
    },
    groupItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 16
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    errorText: { color: "red" },
    searchBar: {
        margin: 16,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
    },
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
    listContainer: {
        padding: 16,
    },
    foodItem: {
        flexDirection: 'row', // Bố trí ngang
        alignItems: 'center', // Căn giữa theo chiều dọc
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    foodInfo: {
        flex: 1, // Chiếm phần còn lại
        flexDirection: 'column',
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold', // In đậm
        color: '#333',
    },
    foodCategory: {
        fontSize: 14,
        color: '#666', // Màu sắc nhẹ hơn
    },
    foodStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        textAlign: 'center',
    },
    avatar: {
        width: 50, // Kích thước hình ảnh
        height: 50,
        borderRadius: 8, // Bo góc nhẹ
        marginRight: 12, // Khoảng cách với phần text
    },
    actionIcons: {
        flexDirection: 'row', // Sắp xếp các icon theo chiều ngang
        alignItems: 'center', // Căn giữa dọc
    },
    foodImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
});