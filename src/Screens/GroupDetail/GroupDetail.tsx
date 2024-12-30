import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, TextInput, ScrollView, ImageBackground } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, ArrowRight, CalendarDays, Clock5, EllipsisVertical, Heart, Info, NotebookText, Plus, Search } from "lucide-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "..";
import { useLazyGetGroupInfoQuery } from "@/Services/group";
import AppData from "@/General/Constants/AppData";
import { Actionsheet, Avatar, Input, Menu, Modal, Pressable } from "native-base";
import { useCreateFoodGroupMutation, useCreateFoodMutation, useDeleteFoodGroupMutation, useLazyGetAllFoodByCategoryQuery, useUpdateFoodGroupMutation } from "@/Services/foodGroup";
import SearchableDropdown from "@/General/Components/SearchableDropdown";
import DateTimePickerInput from "@/General/Components/DateTimePicker";
import { useSelector } from "react-redux";
import { Utils } from "@/General/Utils/Utils";
import { useToast } from "react-native-toast-notifications";
import Globals from "@/General/Constants/Globals";

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
    const [isOpenUpdateActionSheet, setIsOpenUpdateActionSheet] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [formCategory, setFormCategory] = useState<string>('');
    const [formUnit, setFormUnit] = useState<string>('');
    const [formFood, setFormFood] = useState<string>('');
    const [formExpiredate, setFormExpiredate] = useState<any>('2025-01-10 17:22:58');
    const [formQuantity, setFormQuantity] = useState<number>(0);
    const [createFoodGroup, { isLoading: isLoadingCreateFoodGroup, isError: isErrorCreateFoodGroup }] = useCreateFoodGroupMutation();
    const [updateFoodGroup, { isLoading: isLoadingUpdateFoodGroup, isError: isErrorUpdateFoodGroup }] = useUpdateFoodGroupMutation();
    const [deleteFoodGroup, { data: deletedFoodGroup }] = useDeleteFoodGroupMutation();
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [selectedFoodGroupId, setSelectedFoodGroupId] = useState<string>('');
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState(Globals.gFilterFoodGroupList);

    useEffect(() => {
        fetchGroupInfo({ groupId });
    }, [groupId, fetchGroupInfo]);

    useEffect(() => {
        fetchFoodByCategory({ group_id: groupId, category_id: selectedCategory, search: filters.search });
    }, [selectedCategory, fetchFoodByCategory, filters.search]);

    const handleCreateFoodGroup = async () => {
        try {
            await createFoodGroup({
                group_id: groupId,
                food_id: formFood,
                category_id: formCategory,
                unit_name: formUnit,
                quantity: formQuantity,
                exprire_date: formExpiredate
            }).unwrap().then(() => {
                toast.show("Thêm thức ăn thành công", { placement: "top", type: "success" });
                fetchFoodByCategory({ group_id: groupId, category_id: selectedCategory, search: search });
            });
        } catch (error) {
            toast.show("Thêm thức ăn không thành công", { placement: "top", type: "warning" });
        }
    }

    const handleUpdateFoodGroup = async () => {
        try {
            await updateFoodGroup({
                id: selectedFoodGroupId,
                unit_name: formUnit,
                quantity: formQuantity,
            }).unwrap().then(() => {
                toast.show("Sửa thức ăn thành công", { placement: "top", type: "success" });
                fetchFoodByCategory({ group_id: groupId, category_id: selectedCategory, search: search });
            });
        } catch (error) {
            toast.show("Sửa thức ăn không thành công", { placement: "top", type: "warning" });
        }
    }
    const handleDeleteFoodGroup = async (id: string) => {
        try {
            await deleteFoodGroup({ id: id }).unwrap();
            toast.show("Loại bỏ thức ăn thành công", { placement: "top", type: "success" });
            fetchFoodByCategory({ group_id: groupId, category_id: selectedCategory, search: search });
            setIsOpenModalDelete(false);
        } catch (e) {
            console.log(e)
            toast.show("Không thể loại bỏ thức ăn", { placement: "top", type: "warning" });
        }
    }

    const renderItem = (item: any) => {
        return (
            <View
                key={item.id}
                style={[{
                    width: "47%",
                    maxWidth: 200,
                    height: 230,
                    gap: 10,
                    marginBottom: 10,
                }]}
            >
                <View
                    style={[styles.card, {
                        width: "100%",
                        height: 200,
                        borderWidth: 1,
                        borderColor: '#FBFBFB',
                        padding: 10,
                        gap: 10,
                    }]}
                >
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
                            padding: 8,
                            backgroundColor: AppData.colors.text[100],
                            borderRadius: 16,
                            alignItems: 'center',
                            width: 100,
                        }}>
                            <Text style={{
                                fontSize: AppData.fontSizes.medium,
                                fontWeight: "500",
                                color: AppData.colors.text[500],
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
                        flex: 1,
                    }}>
                        {item?.food?.name}
                    </Text>

                    <Menu
                        width={100}
                        style={{ padding: 0 }}
                        trigger={(triggerProps) => {
                            return (
                                <Pressable {...triggerProps} style={{ marginLeft: 'auto' }}>
                                    <EllipsisVertical size={24} color={AppData.colors.text[400]} />
                                </Pressable>
                            );
                        }}
                    >
                        <Menu.Item height={12} alignItems={'center'} justifyContent={'center'} onPress={() => {
                            setSelectedFoodGroupId(item.id);
                            setIsOpenUpdateActionSheet(true);
                        }}>
                            <Text style={{ fontSize: AppData.fontSizes.medium, fontWeight: "600", color: AppData.colors.text[800] }}
                            >{'Sửa'}</Text>
                        </Menu.Item>
                        <Menu.Item height={12} alignItems={'center'} justifyContent={'center'}
                            onPress={() => {
                                setSelectedFoodGroupId(item.id);
                                setIsOpenModalDelete(true);
                            }}>
                            <Text style={{ fontSize: AppData.fontSizes.medium, fontWeight: "600", color: AppData.colors.danger }}>{'Xóa'}</Text>
                        </Menu.Item>
                    </Menu>
                </View>
            </View>
        );
    };

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
        value: food.id,    // Dùng id làm value
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
                            <ArrowLeft size={24} color={AppData.colors.text[900]} />
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
                            <Info size={24} color={AppData.colors.text[900]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={{ gap: 24, padding: 2 }}
                            showsVerticalScrollIndicator={false}>
                            <TouchableOpacity style={[styles.card, { alignItems: "center", flexDirection: "row" }]}
                                onPress={() => navigation.navigate("MENU_CALENDAR", { groupId: groupId, isAdmin: isAdmin })}
                            >
                                <View style={{ flexDirection: "column", gap: 10 }}>
                                    <Text style={{
                                        fontSize: AppData.fontSizes.medium,
                                        fontWeight: "500",
                                        color: AppData.colors.text[900],
                                    }}>
                                        {'Lên lịch món ăn'}
                                    </Text>
                                </View>
                                <View style={{
                                    height: 40,
                                    width: 40,
                                    backgroundColor: AppData.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 8,
                                    marginLeft: 'auto',
                                }}>
                                    <CalendarDays color="white" />
                                </View>
                            </TouchableOpacity>
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
                                    onChangeText={setSearch}
                                    _focus={{
                                        borderColor: AppData.colors.primary,
                                        backgroundColor: "white",
                                    }}
                                    shadow={1}
                                />
                                <TouchableOpacity style={{
                                    height: 64,
                                    width: 64,
                                    backgroundColor: AppData.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 16,
                                    marginLeft: 16,
                                }}
                                    onPress={() => { setFilters({ ...filters, search: search }) }}
                                >
                                    <ArrowRight color="white" />
                                </TouchableOpacity>
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

            {isOpenActionSheet &&
                <Actionsheet isOpen={isOpenActionSheet}
                    onClose={() => setIsOpenActionSheet(false)}
                    hideDragIndicator
                >
                    <Actionsheet.Content borderTopRadius={24}                >
                        <View style={{
                            height: "auto",
                            padding: 24,
                            gap: 16,
                            width: "100%",
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
                            {/* <View style={{ width: "100%", zIndex: 5 }}>
                                <SearchableDropdown
                                    options={categoryOptions || []}
                                    placeholder="Phân loại"
                                    onSelect={(value) => setFormCategory(value)}
                                    isDisabled={true}
                                />
                            </View> */}
                            <View style={{ width: "100%", zIndex: 4 }}>

                                <SearchableDropdown
                                    options={foodsOptions || []}
                                    placeholder="Tên thực phẩm"
                                    isDisabled={true}
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
                                />


                                <View style={{ flex: 1 }}>
                                    <SearchableDropdown
                                        options={unitOptions || []}
                                        placeholder="Đơn vị"
                                        onSelect={(value) => {
                                            const unitName = unitOptions.find((item: any) => item.value === value)?.label;
                                            if (unitName) {
                                                setFormUnit(unitName)
                                            } else {
                                                setFormUnit(value)
                                            }
                                        }
                                        }
                                    />
                                </View>
                            </View>

                            <View style={{ width: "100%", zIndex: 2 }}>
                                < DateTimePickerInput
                                    onChange={(value) => {
                                        const date = Utils.formatDateTime(value);
                                        setFormExpiredate(date);
                                    }
                                    }
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
                                    console.log("formCategory", formCategory, "formFood", formFood, "formQuantity", formQuantity, "formUnit", formUnit, "formExpiredate", formExpiredate);
                                    if (formFood && formQuantity && formUnit && formExpiredate) {
                                        handleCreateFoodGroup();
                                        setIsOpenActionSheet(false);
                                    } else
                                        toast.show("Hãy nhập đày đủ thông tin", { placement: "top", type: "warning" });
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
            }

            {isOpenUpdateActionSheet &&
                <Actionsheet isOpen={isOpenUpdateActionSheet}
                    onClose={() => setIsOpenUpdateActionSheet(false)}
                    hideDragIndicator
                >
                    <Actionsheet.Content borderTopRadius={24}                >
                        <View style={{
                            height: "auto",
                            padding: 24,
                            gap: 16,
                            width: "100%",
                        }}>
                            <View style={{ width: "100%", zIndex: 5 }}>
                                <Text style={{
                                    fontSize: AppData.fontSizes.large,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                    textAlign: "center",
                                }}>
                                    {'Sửa thực phẩm'}
                                </Text>
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
                                />


                                <View style={{ flex: 1 }}>
                                    <SearchableDropdown
                                        options={unitOptions || []}
                                        placeholder="Đơn vị"
                                        onSelect={(value) => {
                                            const unitName = unitOptions.find((item: any) => item.value === value)?.label;
                                            if (unitName) {
                                                setFormUnit(unitName)
                                            } else {
                                                setFormUnit(value)
                                            }
                                        }
                                        }
                                    />
                                </View>
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
                                    console.log("formQuantity", formQuantity, "formUnit", formUnit);
                                    if (formQuantity && formUnit) {
                                        handleUpdateFoodGroup();
                                        setIsOpenUpdateActionSheet(false);
                                    } else
                                        toast.show("Hãy nhập đày đủ thông tin", { placement: "top", type: "warning" });
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
            }

            {
                isOpenModalDelete &&
                <Modal isOpen={isOpenModalDelete} onClose={() => setIsOpenModalDelete(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Xác nhận</Modal.Header>
                        <Modal.Body>
                            <Text style={{
                                fontSize: AppData.fontSizes.medium,
                                fontWeight: "500",
                                color: AppData.colors.text[900],
                                marginLeft: 'auto'
                            }}>
                                {'Bạn có muốn xóa thực phẩm này không?'}
                            </Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={{ flexDirection: "row", gap: 16, justifyContent: "space-around", width: '100%' }}>
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        alignSelf: 'center',
                                        backgroundColor: AppData.colors.danger,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        height: 'auto',
                                        width: 100,
                                    }}
                                    onPress={() => handleDeleteFoodGroup(selectedFoodGroupId)}
                                >
                                    <Text style={{
                                        fontSize: AppData.fontSizes.medium,
                                        fontWeight: "500",
                                        color: AppData.colors.text[100],
                                    }}>
                                        {'Xóa'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        alignSelf: 'center',
                                        backgroundColor: AppData.colors.text[100],
                                        borderColor: AppData.colors.primary,
                                        borderWidth: 0.2,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        height: 'auto',
                                        width: 100,
                                    }}
                                    onPress={() => setIsOpenModalDelete(false)}
                                >
                                    <Text style={{
                                        fontSize: AppData.fontSizes.medium,
                                        fontWeight: "500",
                                        color: AppData.colors.primary,
                                    }}>
                                        {'Hủy'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            }

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
        fontSize: AppData.fontSizes.large,
        fontWeight: "500",
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