import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLazyGetUserGroupQuery } from "@/Services";  // Assuming this is set up in your API slice
import { Button, Spinner } from "native-base";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
// Type definition for Group
interface Group {
  id: string;
  name: string;
}

const mockUserId = '84ef5319-acef-4d19-b048-fdf00ff3e386';

export const ShoppingListScreen: React.FC = () => {
  // Lazy loading the groups with user ID
  const [fetchGroups, { data: groups, isLoading, isError }] = useLazyGetUserGroupQuery();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Fetch groups when the component mounts
    fetchGroups(mockUserId);
  }, [fetchGroups]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner />
        <Text>Loading groups...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load groups. Please try again.</Text>
        <Button onPress={() => fetchGroups(mockUserId)}>
          Retry
        </Button>
      </View>
    );
  }

  // Content state (groups available)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>
      {groups && groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Group }) => (
            <View style={styles.groupItem}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Button
                size="sm"
                onPress={() => navigation.navigate("SHOPPING_LIST_DETAIL", { groupId: item.id })}
              >
                View Shopping List
              </Button>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noGroupsText}>You don't have any groups yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  groupName: {
    fontSize: 16,
  },
  noGroupsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 16,
  },
});
