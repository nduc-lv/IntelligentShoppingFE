import AppData from "@/General/Constants/AppData";
import { ArrowLeft, Heart, Pencil, Plus, ShoppingCart, Trash2 } from "lucide-react-native";
import { Button, Modal, TextArea } from "native-base";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import UploadImage from "@/General/Components/UploadImage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDeleteRecipeMutation, useLazyGetRecipeQuery, useSaveRecipeMutation, useUnsaveRecipeMutation } from "@/Services/recipe";
import { Toast } from "antd-mobile";
import { useToast } from "react-native-toast-notifications";

export const RecipeDetailScreen = ({ route }: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [fetchRecipe, { data: recipe, isLoading, isError, error }] = useLazyGetRecipeQuery();
    const [unSavedRecipe, { data: unsavedRecipe }] = useUnsaveRecipeMutation();
    const recipeId = route.params.recipeId;
    const isMyRecipe = route.params.isMyRecipe
    const [saveRecipe, { data: savedRecipe }] = useSaveRecipeMutation();
    const [deleteRecipe, { data: deletedRecipe }] = useDeleteRecipeMutation();
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchRecipe({ recipeId });
        });
        return unsubscribeFocus;

    }, [recipeId]);

    const handleSaveRecipe = async (recipeId: string) => {
        try {
            await saveRecipe({ recipe_id: recipeId }).unwrap();
            fetchRecipe({ recipeId });
        } catch (e) {
            console.log(e)
            toast.show("Không thể lưu công thức", { placement: "top", type: "warning" });
        }
    }

    const handleUnSavedRecipe = async (recipeId: string) => {
        try {
            await unSavedRecipe({ recipe_id: recipeId }).unwrap();
            fetchRecipe({ recipeId });
        } catch (e) {
            console.log(e)
            toast.show("Không thể bỏ lưu công thức", { placement: "top", type: "warning" });
        }
    }

    const handleDeleteRecipe = async (recipeId: string) => {
        try {
            await deleteRecipe({ recipe_id: recipeId }).unwrap();
            navigation.goBack();
            toast.show("Xóa công thức thành công", { placement: "top", type: "success" });
        } catch (e) {
            console.log(e)
            toast.show("Không thể xóa công thức", { placement: "top", type: "warning" });
        }
    }

    return (
        <View style={styles.container}>
            {/* Background image with absolute position */}
            <ImageBackground
                source={{ uri: recipe?.image_url || 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
                style={styles.backgroundImage}
            >
                <View style={{
                    padding: 16,
                    paddingTop: 32,
                    flexDirection: "row",
                    width: "100%",
                    gap: 16
                }}>
                    <TouchableOpacity
                        style={{
                            height: 48,
                            width: 48,
                            backgroundColor: AppData.colors.background,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 16,

                        }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <ArrowLeft size={24} color={AppData.colors.text[900]} />
                    </TouchableOpacity>


                    {isMyRecipe ?
                        <>
                            <TouchableOpacity
                                style={{
                                    height: 48,
                                    width: 48,
                                    backgroundColor: AppData.colors.background,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 16,
                                    marginLeft: 'auto'
                                }}
                                onPress={() => {
                                    navigation.navigate("EDIT_RECIPE", { recipeId: recipeId });
                                }}
                            >
                                <Pencil size={24} color={AppData.colors.text[500]} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    height: 48,
                                    width: 48,
                                    backgroundColor: AppData.colors.background,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 16,
                                }}
                                onPress={() => {
                                    setIsOpenModalDelete(true)
                                }}
                            >
                                <Trash2 size={24} color={AppData.colors.danger} />
                            </TouchableOpacity>
                        </>
                        :
                        <TouchableOpacity
                            style={{
                                height: 48,
                                width: 48,
                                backgroundColor: AppData.colors.background,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 16,
                                marginLeft: 'auto'
                            }}
                            onPress={() => {
                                if (recipe?.isSaved) {
                                    handleUnSavedRecipe(recipeId)
                                } else
                                    handleSaveRecipe(recipeId)
                            }}
                        >
                            {recipe?.isSaved
                                ? <Heart size={32} color={AppData.colors.primary} fill={AppData.colors.primary} />
                                : <Heart size={32} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                            }
                        </TouchableOpacity>
                    }
                </View>
            </ImageBackground>
            {/* Content of your screen */}
            <View style={styles.content}>
                <ScrollView contentContainerStyle={{ gap: 20, }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.large,
                            fontWeight: "600",
                            color: AppData.colors.text[900],
                            width: "70%"
                        }}>
                            {recipe?.name}
                        </Text>

                        <Text style={{
                            fontSize: AppData.fontSizes.default,
                            fontWeight: "400",
                            color: AppData.colors.text[500],
                            marginLeft: "auto"
                        }}>
                            {recipe?.user?.name}
                        </Text>
                    </View>


                    <View style={{ gap: 10 }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[900],
                        }}>
                            {'Mô tả'}
                        </Text>

                        <Text style={{
                            fontSize: AppData.fontSizes.default,
                            fontWeight: "400",
                            color: AppData.colors.text[800],
                            textAlign: 'justify'
                        }}>
                            {recipe?.description || "Chưa cập nhật"}
                        </Text>
                    </View>

                    <View style={{ gap: 10 }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[900],
                        }}>
                            {'Hướng dẫn'}
                        </Text>

                        <Text style={{
                            fontSize: AppData.fontSizes.default,
                            fontWeight: "400",
                            color: AppData.colors.text[800],
                            textAlign: 'justify'
                        }}>
                            {recipe?.instructions || "Chưa cập nhật"}
                        </Text>
                    </View>

                    <View style={{ gap: 10 }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[900],
                        }}>
                            {'Nguyên liệu'}
                        </Text>
                        {recipe?.foods?.rows.map((item: any) =>
                            <View key={item.id} style={[styles.card, { flexDirection: "row", gap: 16, alignItems: "center" }]}>
                                <View
                                    style={{
                                        height: 48,
                                        width: 48,
                                        backgroundColor: AppData.colors.background,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 16,
                                    }}
                                >
                                    <ImageBackground
                                        source={{ uri: 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
                                        style={StyleSheet.absoluteFillObject}
                                        imageStyle={{ borderRadius: 16 }}
                                    >

                                    </ImageBackground>
                                </View>

                                <Text style={{
                                    fontSize: AppData.fontSizes.medium,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                }}>
                                    {item?.food?.name}
                                </Text>

                                <Text style={{
                                    fontSize: AppData.fontSizes.medium,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                    marginLeft: 'auto',
                                    marginRight: 16
                                }}>
                                    {item?.quantity + " " + item?.unit_name}
                                </Text>
                                {/* 
                                <TouchableOpacity
                                    style={{
                                        height: 48,
                                        width: 48,
                                        backgroundColor: AppData.colors.primary,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 16,
                                    }}
                                >
                                    <Plus size={24} color={AppData.colors.text[100]} fill={AppData.colors.text[100]} />
                                </TouchableOpacity> */}
                            </View>
                        )}

                    </View>

                </ScrollView >
            </View>
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
                                {'Bạn có muốn xóa công thức nấu ăn này không?'}
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
                                    onPress={() => handleDeleteRecipe(recipeId)}
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
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", gap: 30 },
    backgroundImage: {
        position: 'absolute', // Absolute positioning to cover entire screen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: 300,
    },
    content: {
        flex: 1,
        marginTop: 250,
        padding: 24,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        boxShadow: '0px 2px 16px 0px #0633361A',
    },
    card: {
        backgroundColor: "#fff",
        padding: 4,
        borderRadius: 16,
        boxShadow: '0px 2px 8px 0px #0633361A',
        borderWidth: 1, // Độ dày của vạch kẻ
        borderColor: '#0633361A', // Màu sắc của vạch kẻ
    },
});
