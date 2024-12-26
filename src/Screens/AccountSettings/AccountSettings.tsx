import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Image,
	Switch,
	StyleSheet,
	Alert,
} from "react-native";
import { User } from "@/Store/types";
import { userApi, useUpdateMeMutation } from "@/Services";
import { Toast } from "native-base";
import { UserTabScreens } from "..";
import { useSelector } from "react-redux";
import { AuthState } from "@/Store/reducers";
import Loading from "@/General/Components/Loading";
export interface AccountSettingsProps {
	onNavigate: (screen: UserTabScreens) => void;
	goBack: () => void;
	canGoBack: () => boolean;
}
export const AccountSettings = ({
	onNavigate,
	goBack,
	canGoBack,
}: AccountSettingsProps) => {
	const user=useSelector((state:{auth:AuthState})=>(state.auth.user))

	
	const [updateMe, { isLoading }] = useUpdateMeMutation();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		username: "",
		link_avatar: "",
    password:""
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				username: user.username || "",
				link_avatar: user.link_avatar || "",
        password:""
			});
		}
	}, [user]);

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleUpdate = async () => {
    let payload:any={...formData}
    if (!payload.password){
      delete payload.password
    }
		try {
			await updateMe(payload).unwrap();
			Toast.show({
				placement: "top",
				description: "Your account has been updated.",
			});
			if (canGoBack()) {
				goBack();
			} else {
				onNavigate(UserTabScreens.USER_TAB_MAIN);
			}
		} catch (error) {
			Toast.show({
				placement: "top",
				description: "Failed to update account settings.",
			});
		}
	};

	if (!user) {
		return (
			<Loading/>
		);
	}

	return (
		<View style={styles.container}>
			<Image
				source={{ uri: formData.link_avatar }}
				style={styles.avatar}
				defaultSource={{ uri: "https://via.placeholder.com/150" }}
			/>

			<Text style={styles.label}>Name</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
				style={styles.input}
				placeholder="Name"
				value={formData.name}
				onChangeText={(text) => handleInputChange("name", text)}
			/>

			<Text style={styles.label}>Email</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
				style={styles.input}
				placeholder="Email"
				value={formData.email}
				onChangeText={(text) => handleInputChange("email", text)}
				keyboardType="email-address"
			/>

			<Text style={styles.label}>Username</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
				style={styles.input}
				placeholder="Username"
				value={formData.username}
				onChangeText={(text) => handleInputChange("username", text)}
			/>

			<Text style={styles.label}>Avatar Link</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
				style={styles.input}
				placeholder="Avatar Link"
				value={formData.link_avatar}
				onChangeText={(text) => handleInputChange("link_avatar", text)}
			/>
			<Text style={styles.label}>Password</Text>
			<TextInput
        placeholderTextColor={"#9AA6B2"}
				style={styles.input}
				placeholder="Password"
				value={formData.password}
				onChangeText={(text) => handleInputChange("password", text)}
				secureTextEntry={true}
			/>
			<Button
				title={isLoading ? "Updating..." : "Update"}
				onPress={handleUpdate}
				disabled={isLoading}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		alignSelf: "center",
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 10,
		marginVertical: 10
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 10,
	},
});

export default AccountSettings;
