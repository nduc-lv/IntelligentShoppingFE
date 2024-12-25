import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView } from "react-native";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { Avatar } from "native-base";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, Heart, Plus } from "lucide-react-native";
import AppData from "@/General/Constants/AppData";
import { useLazyGetMyRecipeQuery, useUnsaveRecipeMutation } from "@/Services/recipe";
import { Toast } from "antd-mobile";

export const MyRecipeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [fetchSavedRecipe, { data: recipes, isLoading, isError, error }] = useLazyGetMyRecipeQuery();


    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchSavedRecipe();
        });
        return unsubscribeFocus;
    }, []);

    const [unSavedRecipe, { data: unsavedRecipe }] = useUnsaveRecipeMutation();
    const handleUnSavedRecipe = async (recipeId: string) => {
        try {
            await unSavedRecipe({ recipe_id: recipeId }).unwrap();
            fetchSavedRecipe();
        } catch (e) {
            console.log(e)
            Toast.show({ content: "Failed to unsave recipe.", icon: "fail" });
        }
    }
    const renderItem = (item: any) => (
        <TouchableOpacity
            style={[styles.card, {
                width: "47%",
                maxWidth: 200,
                height: 200,
                borderWidth: 1,
                borderColor: '#FBFBFB',
                padding: 10,
                gap: 10,
                marginBottom: 10,
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
                    source={{ uri: item?.image_url || "https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg" }}
                />
                <TouchableOpacity
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
                    onPress={(e) => {
                        e.stopPropagation();
                        handleUnSavedRecipe(item.id);
                    }}
                >
                    <Heart color={AppData.colors.primary} fill={AppData.colors.primary} />
                </TouchableOpacity>
            </View>
            <Text style={{
                fontSize: AppData.fontSizes.default,
                fontWeight: "500",
                color: AppData.colors.text[900],
                textAlign: 'center',
            }}>
                {item.name}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 8 }}>
                <Avatar
                    source={{ uri: item?.user?.avatar || "https://i.pinimg.com/736x/a8/68/32/a86832051be6aa81cdf163e4d03919dd.jpg" }}
                    size="xs"
                />
                <Text style={{
                    fontSize: AppData.fontSizes.default,
                    fontWeight: "500",
                    color: AppData.colors.text[500],
                    marginLeft: 10,
                }}>
                    {item?.user?.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <TouchableOpacity style={[styles.card, { alignItems: "center", flexDirection: "row" }]}
                onPress={() => navigation.navigate("RECIPE_LIST")}
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
            <View style={{ flex: 1, marginTop: 10, gap: 10 }}>
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
                        {'Công thức của tôi'}
                    </Text>
                    {/* <Text style={{
                        fontSize: AppData.fontSizes.default,
                        fontWeight: "bold",
                        color: AppData.colors.primary,
                        marginLeft: 'auto',
                    }}>
                        {'Xem thêm'}
                    </Text> */}
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginTop: 10,
                        gap: 10,
                    }}
                >
                    {recipes && recipes.map((item: any) => renderItem(item))}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("EDIT_RECIPE", { recipeId: 'create' })}>
                <Plus color="white" size={25} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 10 },
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
