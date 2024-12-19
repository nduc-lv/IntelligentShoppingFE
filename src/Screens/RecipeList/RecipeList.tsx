import { Group, useLazyGetAllGroupQuery } from "@/Services/group";
import { ArrowRight, Clock, Clock5, Heart, Notebook, NotebookText, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import AppData from "@/General/Constants/AppData";
import { Avatar, Input } from "native-base";


export const RecipeListScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isLoading = false;
    const isError = false;

    // Dữ liệu giả để kiểm tra
    const data = [
        { id: '1', name: 'Sunny Egg & Toast Avocado' },
        { id: '2', name: 'Pasta with Tomato Sauce' },
        { id: '3', name: 'Grilled Chicken Salad' },
        { id: '4', name: 'Vegan Burrito' },
        { id: '5', name: 'Vegetable Stir Fry' },
        { id: '6', name: 'Chicken Tacos' },
    ];

    const renderRecipeItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={[styles.card, { width: 250, height: 270 }]}
            onPress={() => navigation.navigate("RECIPE_DETAIL", { recipeId: item.id })}
        >
            <ImageBackground
                source={{ uri: 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
                style={StyleSheet.absoluteFillObject}
                imageStyle={{ borderRadius: 16 }}
            >
                <View
                    style={{
                        height: 52,
                        width: 52,
                        backgroundColor: AppData.colors.background,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 16,
                        position: "absolute",
                        top: 16,
                        right: 16,
                    }}
                >
                    <Heart size={32} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                </View>

                <View
                    style={{
                        marginTop: 'auto',
                        padding: 16,
                        gap: 10,
                    }}
                >
                    <Text style={{
                        fontSize: AppData.fontSizes.large,
                        fontWeight: "600",
                        color: AppData.colors.text[100],
                    }}>
                        {item.name}
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Clock5 size={20} color={AppData.colors.text[400]} />
                            <Text style={{
                                fontSize: AppData.fontSizes.default,
                                fontWeight: "400",
                                color: AppData.colors.text[400],
                                marginLeft: 5
                            }}>
                                {'40 min'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <NotebookText size={20} color={AppData.colors.text[400]} />
                            <Text style={{
                                fontSize: AppData.fontSizes.default,
                                fontWeight: "400",
                                color: AppData.colors.text[400],
                                marginLeft: 5
                            }}>
                                {'12'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    const renderIngredientItem = ({ item }: { item: any }) => (
        <View style={{
            marginRight: 16,
        }}>
            <ImageBackground
                source={{ uri: 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
                style={{
                    width: "100%",
                    height: 150,
                }}
                imageStyle={{ borderRadius: 16 }}
            />
            <Text style={{
                fontSize: AppData.fontSizes.medium,
                fontWeight: "600",
                color: AppData.colors.text[900],
                marginTop: 8,
            }}>
                {item.name}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Input
                    w={{ base: "77%", md: "25%" }}
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
                    marginLeft: 'auto',
                }}>
                    <ArrowRight color="white" />
                </View>
            </View>

            <View>
                <Text style={styles.title}>{'Đề xuất món ăn'}</Text>
                <FlatList
                    data={data}
                    renderItem={renderRecipeItem}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 16 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View>
                <Text style={styles.title}>{'Nguyên liệu'}</Text>
                <FlatList
                    data={data}
                    renderItem={renderIngredientItem}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 16 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 30 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        boxShadow: '0px 2px 16px 0px #0633361A',
    },
});

