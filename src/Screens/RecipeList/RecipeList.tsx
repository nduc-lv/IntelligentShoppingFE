import { Group, useLazyGetAllGroupQuery } from "@/Services/group";
import { ArrowRight, Clock, Clock5, Heart, Notebook, NotebookText, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, ImageBackground, ScrollView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import AppData from "@/General/Constants/AppData";
import { Avatar, Input } from "native-base";
import App from "App";
import Globals from "@/General/Constants/Globals";
import { useLazyGetRecipeListQuery, useSaveRecipeMutation } from "@/Services/recipe";
import { Toast } from "antd-mobile";


export const RecipeListScreen = () => {
    const [filters, setFilters] = useState(Globals.gFilterRecipeList);
    const [fetchRecipe, { data: recipes, isLoading, isError, error }] = useLazyGetRecipeListQuery();
    const [saveRecipe, { data: savedRecipe }] = useSaveRecipeMutation();
    const [food_recipes, setFoodRecipes] = useState<any>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchRecipe(filters);
    }, [filters]);

    useEffect(() => {
        if (recipes)
            setFoodRecipes(recipes[0]?.food_recipes);
    }, [recipes]);

    const handleSaveRecipe = async (recipeId: string) => {
        try {
            await saveRecipe({ recipe_id: recipeId }).unwrap();
            fetchRecipe(filters);
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to save recipe.", icon: "fail" });
        }
    }

    const renderRecipeItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity style={[styles.card, { width: 250, height: 270 }]}
                onPress={() => navigation.navigate("RECIPE_DETAIL", { recipeId: item.id })}
            >
                <ImageBackground
                    source={{ uri: item?.image_url || "https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg" }}
                    style={StyleSheet.absoluteFillObject}
                    imageStyle={{ borderRadius: 16 }}
                >
                    <TouchableOpacity
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
                            left: 16,
                        }}
                        onPress={(e) => {
                            e.stopPropagation();
                            setFoodRecipes(item?.food_recipes);
                        }}
                    >
                        <Heart size={32} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                    </TouchableOpacity>
                    <TouchableOpacity
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
                        onPress={(e) => {
                            e.stopPropagation();
                            handleSaveRecipe(item.id);
                        }}
                    >
                        {item?.isSaved
                            ? <Heart size={32} color={AppData.colors.primary} fill={AppData.colors.primary} />
                            : <Heart size={32} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                        }

                    </TouchableOpacity>

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
                                    {item?.food_recipes?.length}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    };

    const renderIngredientItem = ({ item }: { item: any }) => (
        <View style={{
            width: 200,
            marginRight: 16,
        }}>
            <ImageBackground
                source={{ uri: item?.food?.image_url || 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
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
                textAlign: 'center'
            }}>
                {item?.food?.name}
            </Text>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                    value={search}
                    onChangeText={setSearch}
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

            <View>
                <Text style={styles.title}>{'Đề xuất món ăn'}</Text>
                <FlatList
                    data={recipes}
                    renderItem={renderRecipeItem}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 16 }}
                    showsHorizontalScrollIndicator={false}

                />
            </View>

            <View>
                <Text style={styles.title}>{'Thực phẩm'}</Text>
                <FlatList
                    data={food_recipes}
                    renderItem={renderIngredientItem}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 16 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 30 },
    title: {
        fontSize: AppData.fontSizes.large,
        fontWeight: "500",
        color: AppData.colors.text[900],
        marginBottom: 16
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        boxShadow: '0px 2px 16px 0px #0633361A',
    },
});

