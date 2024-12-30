import React from "react";
import { i18n, LocalizationKey } from "@/Localization";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "native-base";
import { RootScreens } from "..";
import AppResource from "@/General/Constants/AppResource";

export const Welcome = (props: {
  onNavigate: (screen: RootScreens) => void }) =>
{
  return (
    <ImageBackground
      source={AppResource.login.bgWelcome}
      style={styles.container}>

      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.txtWelcome}>
          {i18n.t(LocalizationKey.WELCOME)}
        </Text>
        <Button
          style={styles.btnGetStarted}
          onPress={() => props.onNavigate(RootScreens.SIGN_IN)}>

          {i18n.t(LocalizationKey.GET_STARTED)}
        </Button>
      </View>
    </ImageBackground>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50 // Khoảng cách từ nội dung đến đáy màn hình
  },
  btnGetStarted: {
    width: "80%",
    justifyContent: "center",
    backgroundColor: "#53B175",
    borderRadius: 10,
    height: 55,
    marginBottom: 20 // Khoảng cách giữa nút và văn bản
  },
  txtWelcome: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20 // Khoảng cách giữa văn bản và nút
  }
});