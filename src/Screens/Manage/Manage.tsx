import { RootStackParamList } from "@/Navigation";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Beef, ChevronRight, Users, Weight } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from "react-native";

export const ManageScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin screen</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MANAGE_ACCOUNT")}>
                <View style={styles.groupItem}>
                    <View style={styles.leftContent}>
                        <Users size={24} color="#888"></Users>
                        <Text style={styles.itemText}>Quản lý tài khoản</Text>
                    </View>
                    <ChevronRight size={24} color="#888" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("MANAGE_UNIT")}>
                <View style={styles.groupItem}>
                    <View style={styles.leftContent}>
                        <Weight size={24} color="#888"></Weight>
                        <Text style={styles.itemText}>Quản lý đơn vị</Text>
                    </View>
                    <ChevronRight size={24} color="#888" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("MANAGE_FOOD")}>
                <View style={styles.groupItem}>
                    <View style={styles.leftContent}>
                        <Beef size={24} color="#888"></Beef>
                        <Text style={styles.itemText}>Quản lý thực phẩm</Text>
                    </View>
                    <ChevronRight size={24} color="#888" />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
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
});