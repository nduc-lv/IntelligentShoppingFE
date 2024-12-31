import {
	Unit,
	useCreateUnitMutation,
	useDeleteUnitMutation,
	useLazyGetUnitQuery,
	useUpdateUnitMutation,
} from "@/Services/unit";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	Image,
	Modal,
	TextInput,
	Button,
} from "react-native";
import { RootScreens } from "..";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import AppData from "@/General/Constants/AppData";
import { Actionsheet, Input } from "native-base";
import { useToast } from "react-native-toast-notifications";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";

export const ManageUnitScreen = () => {
	const bottomInset = useKeyboardBottomInset();
	const [fetchUnit, { data, isLoading, isError }] = useLazyGetUnitQuery();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [createUnit] = useCreateUnitMutation();
	const [updateUnit] = useUpdateUnitMutation();
	const [deleteUnit] = useDeleteUnitMutation();
	const [modalOption, setModalOption] = useState("");
	const [newUnitName, setNewUnitName] = useState("");
	const [selectedUnit, setSelectedUnit] = useState<Unit | null>();
	const Toast = useToast();

	const handleOpenDialog = (option: string, item: Unit | null = null) => {
		setModalOption(option);
		if (item) setNewUnitName(item.name);
		setSelectedUnit(item);
	};

	const handleCloseDialog = () => {
		setModalOption("");
		setNewUnitName("");
		setSelectedUnit(null);
	};

	const handleSubmit = async () => {
		try {
			if (!newUnitName) {
				Toast.show("Chưa điền tên mới", { placement: "top", type: "warning" });
				return;
			}
			const payload = {
				name: newUnitName,
			};
			if (modalOption === "create") {
				await createUnit(payload).unwrap();
			}
			if (modalOption === "edit") {
				if (!selectedUnit) {
					Toast.show("Chưa chọn đơn vị", { placement: "top", type: "warning" });
					return;
				}
				await updateUnit({ id: selectedUnit.id, ...payload }).unwrap();
			}
			Toast.show("Cập nhật thành công", { placement: "top", type: "success" });
			fetchUnit();
			handleCloseDialog();
		} catch (e) {
			console.log(e);
			Toast.show("Cập nhật thất bại", { placement: "top", type: "warning" });
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteUnit(id);
			Toast.show("Xóa thành công", { placement: "top", type: "success" });
			fetchUnit();
		} catch (e) {
			console.log(e);
			Toast.show("Xóa thất bại", { placement: "top", type: "warning" });
		}
	};

	useEffect(() => {
		fetchUnit();
	}, [fetchUnit]);

	return (
		<View style={styles.container}>
			{isLoading ? (
				<ActivityIndicator
					style={styles.centered}
					size="large"
					color="#0000ff"
				/>
			) : isError ? (
				<View style={styles.header}>
					<View style={styles.centered}>
						<Text style={styles.errorText}>Failed to load.</Text>
					</View>
				</View>
			) : data ? (
				<>
					<FlatList
						data={data}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<View style={styles.unitItem}>
								<Text style={styles.unitName}>{item.name}</Text>
								<View style={styles.actionIcons}>
									<TouchableOpacity
										onPress={() => handleOpenDialog("edit", item)}
									>
										<Edit size={20} color={AppData.colors.primary} />
									</TouchableOpacity>
									<TouchableOpacity onPress={() => handleDelete(item.id)}>
										<Trash size={20} color="#FF3B30" />
									</TouchableOpacity>
								</View>
							</View>
						)}
					/>
				</>
			) : (
				<Text>No info found.</Text>
			)}
			<TouchableOpacity
				style={styles.fab}
				onPress={() => handleOpenDialog("create")}
			>
				<Plus color="white" size={25} />
			</TouchableOpacity>
			<Actionsheet
				isOpen={modalOption === "create" || modalOption === "edit"}
				onClose={() => handleCloseDialog()}
				hideDragIndicator
			>
				<Actionsheet.Content borderTopRadius={24} bottom={bottomInset}>
					<View
						style={{
							height: 150,
							padding: 24,
							gap: 16,
						}}
					>
						<View
							style={{
								width: "100%",
								zIndex: 3,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								gap: 16,
							}}
						>
							<View
								style={{
									width: "100%",
									backgroundColor: "white",
									borderRadius: 10,
									borderWidth: 0.3,
									borderColor: AppData.colors.text[400],
									height: 48, // Approximate height={12} with 'xl' size
									justifyContent: "center",
								}}
							>
								<TextInput
									style={{
										flex: 1,
										fontSize: AppData.fontSizes.medium, // Assuming AppData.fontSizes.medium exists
										paddingHorizontal: 10,
										backgroundColor: "white",
										borderRadius: 10,
									}}
									placeholder="Đơn vị"
                                    placeholderTextColor={AppData.colors.text[400]}
									onChangeText={setNewUnitName} // Directly update state
								/>
							</View>
						</View>
						<TouchableOpacity
							style={{
								padding: 16,
								alignSelf: "center",
								backgroundColor: AppData.colors.primary,
								borderRadius: 16,
								alignItems: "center",
								zIndex: 1,
								minWidth: 200,
							}}
							onPress={() => handleSubmit()}
						>
							<Text
								style={{
									fontSize: AppData.fontSizes.medium,
									fontWeight: "500",
									color: AppData.colors.text[100],
								}}
							>
								{modalOption === "edit" ? "Lưu" : "Tạo mới"}
							</Text>
						</TouchableOpacity>
					</View>
				</Actionsheet.Content>
			</Actionsheet>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f9f9f9" },
	title: {
		flex: 1,
		marginLeft: 8,
		fontSize: 20,
		fontWeight: "bold",
	},
	groupItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 12,
		marginVertical: 8,
		backgroundColor: "#fff",
		borderRadius: 8,
		elevation: 2,
	},
	leftContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	itemText: {
		fontSize: 16,
		color: "#333",
		marginLeft: 16,
	},
	centered: { flex: 1, justifyContent: "center", alignItems: "center" },
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	errorText: { color: "red" },
	unitItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 12,
		marginVertical: 8,
		marginHorizontal: 16,
		backgroundColor: "#fff",
		borderRadius: 8,
		elevation: 2, // Shadow for Android
		shadowColor: "#000", // Shadow for iOS
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	unitName: {
		fontSize: 16,
		color: "#333",
		fontWeight: "bold",
	},
	actionIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16, // Khoảng cách giữa các biểu tượng
	},
	fab: {
		position: "absolute",
		bottom: 35,
		right: 25,
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		backgroundColor: AppData.colors.primary,
		display: "flex",
		borderRadius: 16,
	},
});
