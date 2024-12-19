import AppData from "@/General/Constants/AppData";
import { ArrowLeft, Heart, Plus, ShoppingCart } from "lucide-react-native";
import { TextArea } from "native-base";
import React from "react";
import { View, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";

export const RecipeDetailScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            {/* Background image with absolute position */}
            <ImageBackground
                source={{ uri: 'https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg' }}
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

                        }}
                    >
                        <ShoppingCart size={24} color={AppData.colors.primary} />
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

                        }}
                    >
                        <Heart size={24} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                    </TouchableOpacity>
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
                            {'Sunny Egg & Toast Avocado'}
                        </Text>

                        <Text style={{
                            fontSize: AppData.fontSizes.default,
                            fontWeight: "400",
                            color: AppData.colors.text[500],
                            marginLeft: "auto"
                        }}>
                            {'Tác giả'}
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
                            color: AppData.colors.text[500],
                            textAlign: 'justify'
                        }}>
                            {'Salad bắp cải tím sốt mayonnaise là một món ăn giàu chất xơ tốt cho sức khoẻ và có thể ăn kèm với nhiều món ăn khác nhau. Cùng Bách hoá XANH vào bếp và học cách chế biến món salad siêu hấp dẫn này ngay thôi nào.'}
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
                            color: AppData.colors.text[500],
                            textAlign: 'justify'
                        }}>
                            {"Bước 1: Sơ chế nguyên liệu\n- Rửa sạch các nguyên liệu như rau, thịt và gia vị.\n- Cắt thịt thành những miếng nhỏ vừa ăn.\n\nBước 2: Nấu nước dùng\n- Đun sôi nước, cho xương vào nấu trong khoảng 30 phút.\n- Thêm gia vị như muối, tiêu, hành, tỏi vào để tạo hương vị.\n\nBước 3: Nấu món ăn\n- Cho thịt vào nồi, nấu cho đến khi thịt chín mềm.\n- Thêm rau củ vào nấu cùng, tiếp tục đun cho đến khi tất cả chín đều.\n\nBước 4: Trình bày và thưởng thức\n- Xếp món ăn ra đĩa, rắc một ít gia vị và thưởng thức ngay khi còn nóng."}
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
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) =>
                            <View key={index} style={[styles.card, { flexDirection: "row", gap: 16, alignItems: "center" }]}>
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
                                    {'Cà tím'}
                                </Text>

                                <Text style={{
                                    fontSize: AppData.fontSizes.medium,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                    marginLeft: 'auto'
                                }}>
                                    {'400g'}
                                </Text>

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
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>

                    <TouchableOpacity style={{
                        padding: 16,
                        height: 60,
                        alignSelf: 'center',
                        backgroundColor: AppData.colors.primary,
                        borderRadius: 16,
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[100],
                        }}>
                            {'Thêm vào danh sách mua'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView >
            </View>
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
