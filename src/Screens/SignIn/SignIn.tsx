import React, { useState } from "react";
import { i18n, LocalizationKey } from "@/Localization";
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Toast } from "native-base";
import { RootScreens } from "..";
import axios from "axios";

export const SignIn = (props: {
    onNavigate: (screen: RootScreens) => void;
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://<your-backend-url>/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                Toast.show({
                    description: i18n.t(LocalizationKey.LOGIN_SUCCESS),
                    placement: "top",
                });
                props.onNavigate(RootScreens.MAIN);
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            Toast.show({
                description: i18n.t(LocalizationKey.LOGIN_FAILED),
                placement: "top",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.content}>
                <Text style={styles.txtSignIn}>
                    {i18n.t(LocalizationKey.WELCOME)}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t(LocalizationKey.EMAIL_PLACEHOLDER)}
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t(LocalizationKey.PASSWORD_PLACEHOLDER)}
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button
                    style={styles.btnGetStarted}
                    onPress={handleLogin}
                    isDisabled={loading || !email || !password}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        i18n.t(LocalizationKey.LOGIN)
                    )}
                </Button>
            </View>
            <Button
                    style={styles.btnGetStarted}
                    onPress={() =>{
                        props.onNavigate(RootScreens.MAIN)
                        Toast.show({
                            description:"Logging in!",
                            placement:'top'
                        })
                    }}
                >
                    Development skip login
                </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: "#000",
    },
    btnGetStarted: {
        width: "100%",
        justifyContent: "center",
        backgroundColor: "#53B175",
        borderRadius: 10,
        height: 55,
    },
    txtSignIn: {
        color: "black",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
});
