import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { Settings,LockIcon,HelpCircleIcon, LucideIcon, LogOutIcon } from "lucide-react-native";
import { User } from "@/Store/types";
import { useDispatch } from "react-redux";
import { clearTokens } from "@/Store/reducers";
import { RootScreens,UserTabScreens } from "..";
import Loading from "@/General/Components/Loading";
import { AppDispatch } from "@/Store";
import { RootNavigationContainerRef } from "@/Navigation";
type UserTabListItem ={ title: string; icon: LucideIcon, onClick?: (event: GestureResponderEvent) => void } 
export const UserTab = ({ data, isLoading,onNavigate }: { data: any|User; isLoading: boolean, onNavigate: (screen: UserTabScreens) => void }) => {
  useEffect(()=>{
    console.log(data)
  },[data])
  const dispatch=useDispatch<AppDispatch>();

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  if (!data&& !isLoading) {
    RootNavigationContainerRef.navigate(RootScreens.SIGN_IN)
    return <></>
  }

  const renderSetting = ({ item }: { item: UserTabListItem}) => (
    <TouchableOpacity style={styles.settingItem} onPress={item.onClick}>
      <item.icon size={24} color="#555" />
      <Text style={styles.settingText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const settings:Array<UserTabListItem> = [
    { title: "Account Settings", icon: Settings, onClick:(e)=>{
      onNavigate(UserTabScreens.ACCOUNT_SETTING)
    } },
    { title: "Privacy Settings", icon: LockIcon },
    { title: "Help & Support", icon: HelpCircleIcon },
    { title: "Logout", icon: LogOutIcon, onClick:(e)=>{
      dispatch(clearTokens())
    } },
  ];

  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: data.link_avatar,
          }}
          defaultSource={{uri:"https://via.placeholder.com/150"}}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{data.name??"Unknown"}</Text>
        <Text style={styles.userEmail}>{data.username??"Unknown"}</Text>
        <Text style={styles.userEmail}>{data.email??"Unknown"}</Text>
      </View>

      {/* Settings Section */}
      <FlatList
        data={settings}
        renderItem={renderSetting}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.settingsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  settingsList: {
    marginTop: 16,
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
    elevation: 1,
  },
  settingText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
  },
});
