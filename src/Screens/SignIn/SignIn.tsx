import React, { useState } from "react";
import { i18n, LocalizationKey } from "@/Localization";
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Toast } from "native-base";
import { RootScreens } from "..";
import axios from "axios";
type SignInAndRegisterProps={
    onNavigate: (screen: RootScreens) => void;
}
type SignInAndRegisterChildProps=SignInAndRegisterProps&{
    setFragment: (fragment:any) => any;
}
const SignInAndRegisterFragment={
    LOGIN:0,
    REGISTER:1,
}
export const SignInAndRegister = (props: SignInAndRegisterProps) => {
    const [fragment,setFragment]=useState(SignInAndRegisterFragment.REGISTER);
    console.log(fragment)
    switch(fragment){
        case SignInAndRegisterFragment.REGISTER:
            return <RegisterFragment {...props} setFragment={setFragment}/>
        case SignInAndRegisterFragment.LOGIN:
        default:
            return  <SignInFragment {...props} setFragment={setFragment}/>
    }
};
export const RegisterFragment = (props: SignInAndRegisterChildProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [linkAvatar, setLinkAvatar] = useState(i18n.t(LocalizationKey.LINK_AVATAR_DEFAULT));
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/v1/auth/register", {
                email,
                password,
                username,
                name,
                link_avatar: linkAvatar,
            });

            if (response.status === 200) {
                Toast.show({
                    description: i18n.t(LocalizationKey.REGISTER_SUCCESS),
                    placement: "top",
                });
                props.onNavigate(RootScreens.MAIN);
            } else {
                throw new Error("Registration failed");
            }
        } catch (error) {
            Toast.show({
                description: i18n.t(LocalizationKey.REGISTER_FAILED),
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
                    {i18n.t(LocalizationKey.LOGIN_TITLE)}
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
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t(LocalizationKey.USERNAME_PLACEHOLDER)}
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t(LocalizationKey.NAME_PLACEHOLDER)}
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={linkAvatar}
                    onChangeText={setLinkAvatar}
                    autoCapitalize="none"
                />
                <Button
                    style={styles.btnGetStarted}
                    onPress={handleRegister}
                    isDisabled={loading || !email || !password || !username || !name || !linkAvatar}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        i18n.t(LocalizationKey.REGISTER)
                    )}
                </Button>
                <TouchableOpacity onPress={()=>{
                    props.setFragment(SignInAndRegisterFragment.LOGIN)
                }}>
                    <Text>{ i18n.t(LocalizationKey.SWITCH_TO_LOGIN)}</Text>
                </TouchableOpacity>
            </View>
            <Button
                style={styles.btnGetStarted}
                onPress={() => {
                    props.onNavigate(RootScreens.MAIN);
                    Toast.show({
                        description: "Skipping registration for development!",
                        placement: "top",
                    });
                }}
            >
                Development skip registration
            </Button>

        </View>
    );
};

export const SignInFragment = (props:SignInAndRegisterChildProps)=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
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
                    {i18n.t(LocalizationKey.REGISTER_TITLE)}
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
                <TouchableOpacity onPress={()=>{
                    props.setFragment(SignInAndRegisterFragment.REGISTER)
                }}>
                    <Text>{ i18n.t(LocalizationKey.SWITCH_TO_REGISTER)}</Text>
                </TouchableOpacity>
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
}
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
