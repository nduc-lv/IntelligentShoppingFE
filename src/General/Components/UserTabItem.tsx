import { LucideIcon } from "lucide-react-native";
import React from "react";
import { GestureResponderEvent, TouchableOpacity, Text, StyleSheet } from "react-native";
export type UserTabListItem = {
  title: string,
  icon: LucideIcon,
  onClick?: (event: GestureResponderEvent) => void, };

export const renderUserTabListItem = ({ item }: { item: UserTabListItem }) =>
<TouchableOpacity style={styles.settingItem} onPress={item.onClick}>
		<item.icon size={24} color="#555" />
		<Text style={styles.settingText}>{item.title}</Text>
	</TouchableOpacity>;


const styles = StyleSheet.create({
  settingText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333"
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  }
});