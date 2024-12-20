import AppData from "@/General/Constants/AppData";
import { ArrowLeft, ChevronDown, Heart, Minus, Plus, ShoppingCart } from "lucide-react-native";
import { Actionsheet, Input, TextArea } from "native-base";
import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";

export const EditRecipeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isOpenActionSheet, setIsOpenActionSheet] = useState(false);


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
                        <Heart size={24} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            {/* Content of your screen */}
            <View style={styles.content}>
                <ScrollView contentContainerStyle={{ gap: 20, padding: 1, }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <Input
                            w={{ base: "100%", md: "25%" }}
                            placeholder="Nhập tên công thức"
                            size={"xl"}
                            height={12}
                            bgColor="white"
                            borderRadius={8}
                            borderColor={AppData.colors.text[400]}
                            borderWidth={0.3}
                            _focus={{
                                borderColor: AppData.colors.primary,
                                backgroundColor: "white",
                            }}
                        />
                    </View>


                    <View style={{ gap: 10 }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[900],
                        }}>
                            {'Mô tả'}
                        </Text>

                        <TextArea
                            w={{ base: "100%", md: "25%" }}
                            placeholder="Nhập mô tả"
                            size={AppData.fontSizes.small}
                            totalLines={4}
                            bgColor="white"
                            borderRadius={8}
                            borderColor={AppData.colors.text[400]}
                            borderWidth={0.3}
                            _focus={{
                                borderColor: AppData.colors.primary,
                                backgroundColor: "white",
                            }}
                        />
                    </View>

                    <View style={{ gap: 10 }}>
                        <Text style={{
                            fontSize: AppData.fontSizes.medium,
                            fontWeight: "500",
                            color: AppData.colors.text[900],
                        }}>
                            {'Hướng dẫn'}
                        </Text>

                        <TextArea
                            w={{ base: "100%", md: "25%" }}
                            h={200}
                            placeholder="Nhập hướng dẫn"
                            size={AppData.fontSizes.small}
                            bgColor="white"
                            borderRadius={8}
                            borderColor={AppData.colors.text[400]}

                            borderWidth={0.3}
                            _focus={{
                                borderColor: AppData.colors.primary,
                                backgroundColor: "white",
                            }}
                        />
                    </View>

                    <View style={{ gap: 10 }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                            <Text style={{
                                fontSize: AppData.fontSizes.medium,
                                fontWeight: "500",
                                color: AppData.colors.text[900],
                            }}>
                                {'Nguyên liệu'}
                            </Text>

                            <TouchableOpacity style={{ marginLeft: 'auto' }}
                                onPress={() => setIsOpenActionSheet(true)}
                            >
                                <Plus size={26} color={AppData.colors.primary} />
                            </TouchableOpacity>
                        </View>

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
                                        backgroundColor: AppData.colors.danger,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 16,

                                    }}
                                >
                                    <Minus size={24} color={AppData.colors.text[100]} fill={AppData.colors.text[100]} />
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
                            minWidth: 200,
                            textAlign: 'center'
                        }}>
                            {'Lưu thay đổi'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView >
            </View>

            <Actionsheet isOpen={isOpenActionSheet}
                onClose={() => setIsOpenActionSheet(false)}
                hideDragIndicator

            >
                <Actionsheet.Content borderTopRadius={32}
                    style={{
                        height: 300
                    }}
                >

                </Actionsheet.Content>
            </Actionsheet>
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
