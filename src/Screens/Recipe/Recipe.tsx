import { Group, useLazyGetAllGroupQuery } from "@/Services/group";
import { ArrowRight, Heart, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import AppData from "@/General/Constants/AppData";
import { Avatar } from "native-base";
import { StatusBar } from "expo-status-bar";

export const RecipeScreen = () => {
    const isLoading = false;
    const isError = false;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    // Dữ liệu giả để kiểm tra
    const data = [
        { id: '1', name: 'Sunny Egg & Toast Avocado' },
        { id: '2', name: 'Pasta with Tomato Sauce' },
        { id: '3', name: 'Grilled Chicken Salad' },
        { id: '4', name: 'Vegan Burrito' },
        { id: '5', name: 'Vegetable Stir Fry' },
        { id: '6', name: 'Chicken Tacos' },
        { id: '7', name: 'Chicken Tacos' },
        { id: '8', name: 'Chicken Tacos' },
        { id: '9', name: 'Chicken Tacos' },
        { id: '10', name: 'Chicken Tacos' },
    ];

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={[styles.card,
        {
            width: "47%",
            height: 200,
            borderWidth: 1,
            borderColor: '#FBFBFB',
            padding: 10,
            gap: 10,
            marginBottom: 10
        }]}
            onPress={() => navigation.navigate("RECIPE_DETAIL", { recipeId: item.id })}
        >
            <View style={{ position: "relative" }}>
                <Image
                    style={{
                        width: "100%",
                        height: 90,
                        borderRadius: 16,
                    }}
                    source={{ uri: "https://i.pinimg.com/736x/a8/68/32/a86832051be6aa81cdf163e4d03919dd.jpg" }}
                />
                <View
                    style={{
                        height: 35,
                        width: 35,
                        backgroundColor: AppData.colors.background,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 12,
                        position: "absolute",
                        top: 5,
                        right: 5,
                    }}
                >
                    <Heart color={AppData.colors.primary} fill={AppData.colors.primary} />
                </View>
            </View>

            <Text style={{
                fontSize: AppData.fontSizes.default,
                fontWeight: "500",
                color: AppData.colors.text[900],
                marginLeft: 'auto',
                textAlign: 'center'
            }}>
                {item.name}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 8, }}>
                <Avatar
                    source={{ uri: "https://i.pinimg.com/736x/a8/68/32/a86832051be6aa81cdf163e4d03919dd.jpg" }}
                    size="xs"
                />
                <Text style={{
                    fontSize: AppData.fontSizes.default,
                    fontWeight: "500",
                    color: AppData.colors.text[500],
                    marginLeft: 10
                }}>
                    {'Nguyễn Huy'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <TouchableOpacity style={[styles.card, { alignItems: "center", flexDirection: "row" }]}
                onPress={() => { navigation.navigate("RECIPE_LIST") }}
            >
                <View style={{ flexDirection: "column", gap: 10 }}>
                    <Text style={{
                        fontSize: AppData.fontSizes.medium,
                        fontWeight: "500",
                        color: AppData.colors.text[900],
                    }}>
                        {'Tìm kiếm thêm'}
                    </Text>
                    <Text style={{ fontSize: AppData.fontSizes.small }}>
                        {'Xem thêm nhiều công thức nấu ăn hơn'}
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
                    <ArrowRight color="white" />
                </View>
            </TouchableOpacity>

            <View style={{ flex: 1, marginTop: 10 }}>
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Text style={{
                        fontSize: AppData.fontSizes.large,
                        fontWeight: "500",
                        color: AppData.colors.text[900],
                    }}>
                        {'Công thức đã lưu'}
                    </Text>

                    <Text style={{
                        fontSize: AppData.fontSizes.default,
                        fontWeight: "bold",
                        color: AppData.colors.primary,
                        marginLeft: 'auto'
                    }}>
                        {'Xem thêm'}
                    </Text>
                </View>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-around' }}
                    contentContainerStyle={{ marginTop: 10, paddingBottom: 5 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: "#fff", }}
                // ListEmptyComponent={() => isLoading ? <ActivityIndicator /> : null}
                />
            </View>
            <TouchableOpacity style={styles.fab} onPress={() => { navigation.navigate("EDIT_RECIPE", { recipeId: '' }) }}>
                <Plus color="white" size={25} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 10 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        width: "100%",
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
