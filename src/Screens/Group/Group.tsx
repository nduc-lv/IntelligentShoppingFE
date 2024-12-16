import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface IGroupProps {
  data: any;
  isLoading: boolean;
}

export const Group = (props: IGroupProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>
    </View>
  );
}

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
});