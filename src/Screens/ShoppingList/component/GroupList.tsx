import React from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList } from "react-native";
import { Button } from "native-base";
import { StatusBar } from "expo-status-bar";
import { i18n, LocalizationKey } from "@/Localization";
import AppResource from "@/General/Constants/AppResource";

export interface Group {
  name: string;
  id: string;
}

interface GroupListProps {
  groups: Group[];
  onGroupSelect: (groupId: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ groups, onGroupSelect }) => {
  if (groups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No group available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.groupItem}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Button
            size="sm"
            onPress={() => onGroupSelect(item.id)}
            style={styles.groupButton}
          >
            Select
          </Button>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  groupButton: {
    backgroundColor: "#007AFF",
  },
});
