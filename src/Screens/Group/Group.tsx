import { Group, useLazyGetAllGroupQuery } from "@/Services/group";
import { ChevronRight, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";

export const GroupScreen = () => {
  const [fetchGroup, { data = [], isLoading, isError }] = useLazyGetAllGroupQuery();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchGroup();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>
      {isLoading ? (
        <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load shopping lists.</Text>
        </View>
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.group_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("GROUP_DETAIL", { groupId: item.group_id, isAdmin: item.is_admin })}>
              <View style={styles.groupItem}>
                <View style={styles.leftContent}>
                  <Image
                    defaultSource={{ uri: "https://via.placeholder.com/150" }}
                    style={styles.groupImage}
                  />
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <ChevronRight size={24} color="#888" />
              </View>
            </TouchableOpacity>
          )}
          // onEndReached={() =>
          //   setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          // }
          onEndReachedThreshold={0.5}
        />
      ) : (
        <Text>No groups found.</Text>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => console.log("Add button pressed!")}>
        <Plus color="white" size={25} />
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
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", margin: 16 },
  itemsContainer: { maxHeight: 400 }, // You can adjust the height based on your needs
  itemRow: { marginBottom: 12 }, // Add margin for spacing between items
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  groupImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});