import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useLazyGetUserGroupQuery } from "@/Services/shoppingList";
import { Button, Spinner } from "native-base";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import { ChevronRight } from "lucide-react-native";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
// Type definition for Group
interface Group {
  id: string;
  name: string;
}

// const userInfo.id = '67ecf6e5-c4aa-461f-930f-e03fe0f8f6b2';

export const ShoppingListScreen: React.FC = () => {
  // Lazy loading the groups with user ID
  const [fetchGroups, { data, isLoading, isError, currentData }] = useLazyGetUserGroupQuery();
  const [userId, setUserId] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Fetch groups when the component mounts
    fetchGroups({});
    // fetchGroups(userInfo.id);
  }, [fetchGroups]);


  useEffect(() => {
    console.log("data",data)
  }, [data])
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
        <Button onPress={() => fetchGroups({})}>
          Retry
        </Button>
      </View>
    );
  }

  // Content state (groups available)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Group To View</Text>
      {data && data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Group }) => (
            <TouchableOpacity style={styles.groupItem} onPress={() => navigation.navigate("SHOPPING_LIST_DETAIL", { groupId: item.id })}>
              <Text style={styles.groupName}>{item.name}</Text>
              {/* <Button
                size="sm"
                onPress={() => navigation.navigate("SHOPPING_LIST_DETAIL", { groupId: item.id })}
              >
                View Shopping List
              </Button> */}
              <ChevronRight size={24} color="#888" />
            </TouchableOpacity>
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
  buttonGroup: {
    flexDirection:"row", justifyContent:"space-between", width:"100%"
  }
});
