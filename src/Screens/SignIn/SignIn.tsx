import React, { useEffect, useState } from "react";
import { i18n, LocalizationKey } from "@/Localization";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Toast } from "native-base";
import { RootScreens } from "..";
import { userApi } from "@/Services";
import { useDispatch, useSelector } from "react-redux";
import { AuthState, setTokens } from "@/Store/reducers";
import { AppDispatch } from "@/Store";
type SignInAndRegisterProps = {
	onNavigate: (screen: RootScreens) => void;
};
type SignInAndRegisterChildProps = SignInAndRegisterProps & {
	setFragment: (fragment: any) => any;
};
const SignInAndRegisterFragment = {
	LOGIN: 0,
	REGISTER: 1,
};
export const SignInAndRegister = (props: SignInAndRegisterProps) => {

	const [fragment, setFragment] = useState(SignInAndRegisterFragment.LOGIN);
	switch (fragment) {
		case SignInAndRegisterFragment.REGISTER:
			return <RegisterFragment {...props} setFragment={setFragment} />;
		case SignInAndRegisterFragment.LOGIN:
		default:
			return <SignInFragment {...props} setFragment={setFragment} />;
	}
};
export const RegisterFragment = (props: SignInAndRegisterChildProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [linkAvatar, setLinkAvatar] = useState(
		"https://via.placeholder.com/150"
	);
	const [register, { isLoading, error, data }] = userApi.useRegisterMutation();
	const dispatch = useDispatch<AppDispatch>();
	const handleRegister = async () => {
		try {
			const response = await register({
				email,
				password,
				username,
				name,
				link_avatar: linkAvatar,
			}).unwrap();
			if (response?.accessToken) {
				dispatch(setTokens({ accessToken: (response.accessToken as string) }))
			}
			Toast.show({
				description: i18n.t(LocalizationKey.REGISTER_SUCCESS),
				placement: "top",
			});
		} catch {
			Toast.show({
				description: i18n.t(LocalizationKey.REGISTER_FAILED),
				placement: "top",
			});
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
					onPress={(e)=>{
						try{
							e.preventDefault()
						} catch(e){

						}
						handleRegister()
					}}
					isDisabled={
						isLoading ||
						!email ||
						!password ||
						!username ||
						!name ||
						!linkAvatar
					}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						i18n.t(LocalizationKey.REGISTER)
					)}
				</Button>
				<TouchableOpacity
					onPress={() => {
						props.setFragment(SignInAndRegisterFragment.LOGIN);
					}}
				>
					<Text>{i18n.t(LocalizationKey.SWITCH_TO_LOGIN)}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export const SignInFragment = (props: SignInAndRegisterChildProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [login, { isLoading, error, data }] = userApi.useLoginMutation();
	const dispatch = useDispatch<AppDispatch>()
	const handleLogin = async () => {
		try {
			const response = await login({
				email,
				password,
			}).unwrap();
			if (response?.accessToken) {
				dispatch(setTokens({ accessToken: (response.accessToken as string) }))
			}
			Toast.show({
				description: i18n.t(LocalizationKey.LOGIN_SUCCESS),
				placement: "top",
			});
		} catch (error) {
			console.error(error)
			Toast.show({
				description: i18n.t(LocalizationKey.LOGIN_FAILED),
				placement: "top",
			});
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
					onPress={(e)=>{
						try{
							e.preventDefault()
						} catch(e){
							
						}
						handleLogin()
					}}
					isDisabled={isLoading || !email || !password}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						i18n.t(LocalizationKey.LOGIN)
					)}
				</Button>
				<TouchableOpacity
					onPress={() => {
						props.setFragment(SignInAndRegisterFragment.REGISTER);
					}}
				>
					<Text>{i18n.t(LocalizationKey.SWITCH_TO_REGISTER)}</Text>
				</TouchableOpacity>
			</View>
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
