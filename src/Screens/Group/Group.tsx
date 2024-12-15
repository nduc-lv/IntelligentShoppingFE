import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface IGroupProps {
    data: any;
    isLoading: boolean;
  }

export const Group = (props: IGroupProps) => {
    return (
        <View style={styles.container}>
          
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });