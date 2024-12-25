import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, TextInput, ScrollView, ImageBackground } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, ArrowRight, Clock5, EllipsisVertical, Heart, Info, NotebookText, Plus, Search } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { useLazyGetGroupInfoQuery } from "@/Services/group";
import AppData from "@/General/Constants/AppData";
import { Actionsheet, Avatar, Input } from "native-base";
import { FlatList } from "react-native";
import { useLazyGetAllCategoryQuery } from "@/Services/category";
import { useCreateFoodGroupMutation, useCreateFoodMutation, useLazyGetAllFoodByCategoryQuery } from "@/Services/foodGroup";
import { useLazyGetUnitsQuery } from "@/Services/unit";
import SearchableDropdown from "@/General/Components/SearchableDropdown";
import { DatePicker } from "antd-mobile";
import DateTimePickerInput from "@/General/Components/DateTimePicker";
import { useLazyGetAllFoodQuery } from "@/Services/shoppingList";
import { useSelector } from "react-redux";
import { Utils } from "@/General/Utils/Utils";

type GroupRouteParams = {
    GroupDetail: { groupId: string, isAdmin: boolean };
};

export const GroupDetailScreen = () => {
    const route = useRoute<RouteProp<GroupRouteParams, "GroupDetail">>();
    const { groupId, isAdmin } = route.params;
    const [fetchGroupInfo, { data, isLoading, isError }] = useLazyGetGroupInfoQuery();
    const [fetchFoodByCategory, { data: myFoods, isLoading: isLoadingFoodByCategory, isError: isErrorFoodByCategory }] = useLazyGetAllFoodByCategoryQuery();
    const { categorys, units, foods } = useSelector((state: any) => state.data);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isOpenActionSheet, setIsOpenActionSheet] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [formCategory, setFormCategory] = useState<string>('');
    const [formUnit, setFormUnit] = useState<string>('');
    const [formFood, setFormFood] = useState<string>('');
    const [formExpiredate, setFormExpiredate] = useState<any>('2025-02-20 17:22:58');
    const [formQuantity, setFormQuantity] = useState<number>(0);
    const [createFood, { isLoading: isLoadingCreateFood, isError: isErrorCreateFood }] = useCreateFoodMutation();
    const [createFoodGroup, { isLoading: isLoadingCreateFoodGroup, isError: isErrorCreateFoodGroup }] = useCreateFoodGroupMutation();

    useEffect(() => {
        fetchGroupInfo({ groupId });
    }, [groupId, fetchGroupInfo]);

    useEffect(() => {
        fetchFoodByCategory({ group_id: groupId, category_id: selectedCategory });
    }, [selectedCategory, fetchFoodByCategory]);

    const handleCreateFoodGroup = async () => {
        try {
            if (foods.find((food: any) => food.id === formFood)) {
                await createFoodGroup({ group_id: groupId, food_id: formFood, category_id: formCategory, unit_name: formUnit, quantity: formQuantity, exprire_date: formExpiredate }).unwrap();
            } else {
                await createFood({ name: formFood, category_id: formCategory }).unwrap().then(async (res: any) => {
                    await createFoodGroup({
                        group_id: groupId,
                        food_id: res?.dataValues?.id,
                        category_id: formCategory,
                        unit_name: formUnit,
                        quantity: formQuantity,
                        exprire_date: formExpiredate
                    }).unwrap().then(() => {
                        fetchFoodByCategory({ group_id: groupId, category_id: selectedCategory });
                    })
                })
            }

        } catch (error) {

        }
    }

    const renderRecipeItem = ({ item }: { item: any }) => (
        <View key={item.id} style={[{ width: 290, height: 270, padding: 0 }]}
        >
            <ImageBackground
                source={{ uri: 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
                style={{
                    width: "100%",
                    height: 200,
                }}
                imageStyle={{ borderRadius: 16 }}
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <View style={{ flexDirection: 'column', gap: 10 }}>
                    <Text style={{
                        fontSize: AppData.fontSizes.large,
                        fontWeight: "600",
                        color: AppData.colors.text[900],
                        marginTop: 8,
                    }}>
                        {item.name + ' x2'}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Clock5 size={20} color={AppData.colors.text[400]} />
                        <Text style={{
                            fontSize: AppData.fontSizes.default,
                            fontWeight: "400",
                            color: AppData.colors.text[400],
                            marginLeft: 5
                        }}>
                            {'23/08/23'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        marginLeft: 'auto'
                    }}
                    onPress={() => {

                    }}>
                    <EllipsisVertical size={24} color={AppData.colors.text[400]} />
                </TouchableOpacity>
            </View>


        </View>
    );

    const renderItem = (item: any) => {
        return (
            <View key={item.id}
                style={[{
                    width: "47%",
                    maxWidth: 200,
                    height: 230,
                    gap: 10,
                    marginBottom: 10,
                }]}>
                <View
                    style={[styles.card, {
                        width: "100%",
                        height: 200,
                        borderWidth: 1,
                        borderColor: '#FBFBFB',
                        padding: 10,
                        gap: 10,
                    }]}>
                    <ImageBackground
                        source={{ uri: 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
                        style={[StyleSheet.absoluteFillObject, {
                            alignItems: 'center',
                        }]}
                        imageStyle={{
                            borderRadius: 16,
                        }}
                    >
                        <View style={{
                            marginTop: 10,
                            padding: 10,
                            backgroundColor: AppData.colors.text[500],
                            borderRadius: 16,
                            alignItems: 'center',
                            width: 80,
                        }}>
                            <Text style={{
                                fontSize: AppData.fontSizes.medium,
                                fontWeight: "500",
                                color: AppData.colors.text[100],
                            }}>
                                {item?.quantity + ' ' + item?.unit_name}
                            </Text>
                        </View>


                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[100],
                            marginTop: 'auto',
                            marginBottom: 10,
                        }}>
                            {`Còn ${Utils.calculateDaysRemaining(item?.exprire_date)} ngày`}
                        </Text>
                    </ImageBackground>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                }}>
                    <Text style={{
                        fontSize: AppData.fontSizes.large,
                        fontWeight: "500",
                        color: AppData.colors.text[900],
                        marginTop: 'auto',
                        textAlign: 'center',
                        flex: 1
                    }}>
                        {item?.food?.name}
                    </Text>

                    <TouchableOpacity
                        style={{
                            marginLeft: 'auto'
                        }}
                        onPress={() => {

                        }}>
                        <EllipsisVertical size={24} color={AppData.colors.text[400]} />
                    </TouchableOpacity>

                </View>
            </View>
        );
    };

    const data1 = [
        { id: '1', name: 'Cơm gà chiên trứng' },
        { id: '2', name: 'Pasta with Tomato Sauce' },
        { id: '3', name: 'Grilled Chicken Salad' },
        { id: '4', name: 'Vegan Burrito' },
        { id: '5', name: 'Vegetable Stir Fry' },
        { id: '6', name: 'Chicken Tacos' },
    ];

    const categoryOptions = categorys && categorys.map((category: any) => ({
        label: category.name,  // Dùng name làm label
        value: category.id,    // Dùng id làm value
    }));

    const unitOptions = units && units.map((unit: any) => ({
        label: unit.name,  // Dùng name làm label
        value: unit.id,    // Dùng id làm value
    }))

    const foodsOptions = foods && foods.map((food: any) => ({
        label: food.name,  // Dùng name làm label
        value: food.name,    // Dùng id làm value
    }))

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
            ) : isError ? (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootScreens.MAIN)}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load shopping lists.</Text>
                    </View>
                </View>
            ) : data ? (
                <>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate(RootScreens.MAIN)}>
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                        <Image
                            // source={{
                            //     uri: data.link_avatar,
                            // }}
                            defaultSource={{ uri: "https://via.placeholder.com/150" }}
                            style={styles.groupImage}
                        />
                        <Text style={styles.title}>{data.rows[0].group.name ?? "Unknown"}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("GROUP_INFO", { groupId: groupId, isAdmin: isAdmin })}>
                            <Info size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={{ gap: 24 }}
                            showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Input
                                    flex={1}
                                    InputLeftElement={<Search style={{ marginLeft: 15 }} size={28} color={AppData.colors.primary} />}
                                    placeholder="Tìm kiếm"
                                    size={"xl"}
                                    height={16}
                                    bgColor="white"
                                    borderRadius={16}
                                    borderColor={'#fff'}
                                    borderWidth={0.3}
                                    _focus={{
                                        borderColor: AppData.colors.primary,
                                        backgroundColor: "white",
                                    }}
                                    shadow={1}
                                />
                                <View style={{
                                    height: 64,
                                    width: 64,
                                    backgroundColor: AppData.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 16,
                                    marginLeft: 16,
                                }}>
                                    <ArrowRight color="white" />
                                </View>
                            </View>

                            <View>
                                <Text style={{
                                    fontSize: AppData.fontSizes.large,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                    marginBottom: 16
                                }}>{'Thức ăn còn lại'}</Text>
                                <FlatList
                                    data={data1}
                                    renderItem={renderRecipeItem}
                                    horizontal
                                    keyExtractor={(item) => item.id}
                                    contentContainerStyle={{ gap: 16 }}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={{
                                    fontSize: AppData.fontSizes.large,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                    marginBottom: 16,
                                }}>{'Thực phẩm'}</Text>

                                <ScrollView horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 10 }}
                                >
                                    <TouchableOpacity style={{
                                        padding: 10,
                                        alignSelf: 'center',
                                        backgroundColor: selectedCategory === 'all' ? AppData.colors.primary : AppData.colors.background,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        boxShadow: '0px 2px 2px 0px #0633361A',
                                    }}
                                        onPress={() => setSelectedCategory('all')}
                                    >
                                        <Text style={{
                                            fontSize: AppData.fontSizes.medium,
                                            fontWeight: "500",
                                            color: selectedCategory === 'all' ? AppData.colors.text[100] : AppData.colors.text[500],
                                        }}>
                                            {'Tất cả'}
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        categorys && categorys.map((item: any) => {
                                            return (
                                                <TouchableOpacity key={item?.id}
                                                    style={{
                                                        padding: 10,
                                                        alignSelf: 'center',
                                                        backgroundColor: selectedCategory === item?.id ? AppData.colors.primary : AppData.colors.background,
                                                        borderRadius: 16,
                                                        alignItems: 'center',
                                                        boxShadow: '0px 2px 2px 0px #0633361A',
                                                    }}>
                                                    <Text style={{
                                                        fontSize: AppData.fontSizes.medium,
                                                        fontWeight: "500",
                                                        color: selectedCategory === item?.id ? AppData.colors.text[100] : AppData.colors.text[500],
                                                    }}
                                                        onPress={() => setSelectedCategory(item?.id)}
                                                    >
                                                        {item?.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>

                                <View style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    justifyContent: "flex-start",
                                    marginTop: 10,
                                    gap: 16,
                                }}
                                >
                                    {myFoods && myFoods.map((item: any) => renderItem(item))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>


                </>
            ) : (
                <Text>No info found.</Text>
            )}
            <TouchableOpacity style={styles.fab} onPress={() => setIsOpenActionSheet(true)}>
                <Plus color="white" size={25} />
            </TouchableOpacity>
            <Actionsheet isOpen={isOpenActionSheet}
                onClose={() => setIsOpenActionSheet(false)}
                hideDragIndicator
            >
                <Actionsheet.Content borderTopRadius={24}                >
                    <View style={{
                        height: "auto",
                        padding: 24,
                        gap: 16
                    }}>
                        <View style={{ width: "100%", zIndex: 5 }}>
                            <Text style={{
                                fontSize: AppData.fontSizes.large,
                                fontWeight: "500",
                                color: AppData.colors.text[900],
                                textAlign: "center",
                            }}>
                                {'Tạo thực phẩm'}
                            </Text>
                        </View>
                        <View style={{ width: "100%", zIndex: 5 }}>
                            <SearchableDropdown
                                options={categoryOptions || []}
                                placeholder="Phân loại"
                                onSelect={(value) => setFormCategory(value)}

                            />
                        </View>
                        <View style={{ width: "100%", zIndex: 4 }}>
                            <SearchableDropdown
                                options={foodsOptions || []}
                                placeholder="Tên thực phẩm"
                                onSelect={(value) => setFormFood(value)}

                            />
                        </View>
                        <View style={{ width: "100%", zIndex: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                            <Input
                                width={"40%"}
                                placeholder="Số lượng"
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
                                keyboardType="numeric" // Hiển thị bàn phím số và dấu chấm (trên một số thiết bị)
                                onChangeText={(text) => {
                                    const numericValue = parseFloat(text.replace(/[^0-9.]/g, "")); // Loại bỏ ký tự không phải số, chuyển thành số
                                    if (!isNaN(numericValue)) {
                                        setFormQuantity(numericValue); // Cập nhật giá trị
                                    } else {
                                        setFormQuantity(0); // Trường hợp nhập không hợp lệ, đặt giá trị mặc định là 0
                                    }
                                }}
                                value={formQuantity ? String(formQuantity) : ""}
                            />


                            <View style={{ flex: 1 }}>
                                <SearchableDropdown
                                    options={unitOptions || []}
                                    placeholder="Đơn vị"
                                    onSelect={(value) => setFormUnit(value)}

                                />
                            </View>
                        </View>

                        <View style={{ width: "100%", zIndex: 2 }}>
                            < DateTimePickerInput
                                onChange={(value) => setFormExpiredate(value?.toString())}
                                placeholder="Ngày hết hạn"
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
                            onPress={() => {
                                handleCreateFoodGroup();
                            }}
                        >
                            <Text style={{
                                fontSize: AppData.fontSizes.medium,
                                fontWeight: "500",
                                color: AppData.colors.text[100],
                            }}>
                                {'Lưu'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </Actionsheet.Content>
            </Actionsheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.1,
        fontSize: AppData.fontSizes.large,
        fontWeight: "400",
    },
    title: {
        flex: 1,
        marginLeft: 8,
        fontSize: 20,
        fontWeight: "bold",
    },
    groupImage: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginLeft: 8,
        marginRight: 8,
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red" },
    content: {
        flex: 1, padding: 16, backgroundColor: "#fff", gap: 30
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        boxShadow: '0px 2px 16px 0px #0633361A',
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
});