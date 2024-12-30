import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { Food, useCreateFoodMutation, useDeleteFoodMutation, useLazyGetAllFood2Query, useUpdateFoodMutation } from "@/Services/food";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react-native";
import { RootScreens } from "..";
import { Category } from "@/Services/food";
import { useLazyGetAllCategoryQuery } from "@/Services/category";
import SearchableDropdown from "@/General/Components/SearchableDropdown";
import { Actionsheet, Avatar, Input } from "native-base";
import AppData from "@/General/Constants/AppData";
import { useToast } from "react-native-toast-notifications";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppConfig from "@/General/Constants/AppConfig";

export const ManageFoodScreen = () => {
    const safeAreaInsets=useSafeAreaInsets()
    const bottomInset=useKeyboardBottomInset()
    const [fetchFood, { data: foodData, isLoading: isFoodLoading, isError: isFoodError }] = useLazyGetAllFood2Query();
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
    const Toast = useToast();

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
                Toast.show("Chưa điền tên mới", { placement: "top", type: "warning" });
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
                    Toast.show("Chưa chọn thực phẩm", { placement: "top", type: "warning" });
                    return;
                }
                await updateFood({ id: selectedFood.id, ...payload }).unwrap();
            }
            Toast.show("Cập nhật thành công", { placement: "top", type: "success" });
            fetchFood();
            handleCloseDialog();
        } catch (e) {
            console.log(e)
            Toast.show("Cập nhật thất bại", { placement: "top", type: "warning" });
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteFood(id);
            Toast.show("Xóa thành công", { placement: "top", type: "success" });
            fetchFood();
        } catch (e) {
            console.log(e)
            Toast.show("Xóa thất bại", { placement: "top", type: "warning" });
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
                source={{ uri: item.image_url ?? AppConfig.defaultAvatar}}
                style={styles.avatar}
                defaultSource={{ uri: AppConfig.defaultAvatar}}
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
        <View style={{...styles.container,
            paddingTop: safeAreaInsets.top,
            paddingBottom: safeAreaInsets.bottom,
            paddingLeft: safeAreaInsets.left,
            paddingRight: safeAreaInsets.right,
        }}>
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
                <>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate(RootScreens.ADMIN)}>
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{"Quản lý thực phẩm"}</Text>
                    </View>
                    <TextInput
                        style={styles.searchBar}
                        placeholderTextColor={AppData.colors.text[400]}
                        placeholder="Tìm kiếm thực phẩm..."
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={filteredFood}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderFoodItem(item)}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
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
                <Actionsheet.Content borderTopRadius={24}      bottom={bottomInset}>
                    <View style={{
                        padding: 24,
                        gap: 16,
                    }}>
                        {selectedFood?.image_url&&<View style={{ width: "100%", zIndex: 4 }}>
                            <Image
                                source={{ uri: selectedFood?.image_url ?? 'https://via.placeholder.com/150' }}
                                style={styles.foodImage}
                            />
                        </View>
                        }       
                        <View style={{ width: "100%", zIndex: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                            <TextInput
                                style={{
                                    flex:1,
                                    fontSize: AppData.fontSizes.medium, // Approximate equivalent of size="xl"
                                    height: 48, // 12 multiplied by 4
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    borderColor: AppData.colors.text[400],
                                    borderWidth: 0.3,
                                    paddingHorizontal: 10, // Padding for better input experience
                                }}
                                placeholder="Tên thực phẩm"
                                placeholderTextColor={AppData.colors.text[400]}
                                onFocus={(e) => {
                                    e.target.setNativeProps({
                                    style: { borderColor: AppData.colors.primary, backgroundColor: 'white' },
                                    });
                                }}
                                onChangeText={setNewFoodName}
                                />
                        </View>
                        <View style={{ width: "100%", zIndex: 3,flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                            <View style={{flex:1, height:48}}>
                            <SearchableDropdown
                                options={categoryOptions || []}
                                placeholder="Phân loại"
                                onSelect={(value) => setNewCategory(value)}
                            />
                            </View>
                        </View>
                        <TouchableOpacity style={{
                            padding: 16,
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