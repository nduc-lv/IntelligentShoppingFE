import AppData from "@/General/Constants/AppData";
import { RootStackParamList } from "@/Navigation";
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import {
	ArrowLeft,
	ChevronRight,
	Info,
	Plus,
	Trash2,
} from "lucide-react-native";
import moment, { Moment } from "moment";
import React, { useState, useEffect } from "react";
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
	ScrollView,
} from "react-native";
import { RootScreens } from "..";
import {
	useCreateMenuMutation,
	useDeleteMenuMutation,
	useLazyGetMenuQuery,
} from "@/Services/menu";
import { Actionsheet } from "native-base";
import toast from "react-native-toast-notifications/lib/typescript/toast";
import SearchableDropdown from "@/General/Components/SearchableDropdown";
import { useLazyGetRecipeListQuery } from "@/Services/recipe";
import { useToast } from "react-native-toast-notifications";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MenuCalendarRouteParams = {
	MenuCalendarInfo: { groupId: string; isAdmin: boolean };
};

const mealOptions = [
	{ label: "Bữa sáng", value: "breakfast" },
	{ label: "Bữa trưa", value: "lunch" },
	{ label: "Bữa tối", value: "dinner" },
];

type SelectedRecipe = {
	recipe_id: string;
};

const hasDuplicatesOrEmpty = (array: SelectedRecipe[]): boolean => {
	const set = new Set<SelectedRecipe>();
	for (const item of array) {
		if (item.recipe_id === "" || set.has(item)) {
			return true; // Nếu gặp item trống hoặc trùng lặp
		}
		set.add(item);
	}
	return false; // Không có trùng lặp hoặc item trống
};

export const MenuCalendarScreen = () => {
	const safeAreaInsets = useSafeAreaInsets();
	const bottomInset = useKeyboardBottomInset();
	const route =
		useRoute<RouteProp<MenuCalendarRouteParams, "MenuCalendarInfo">>();
	const { groupId, isAdmin } = route.params;
	const [currentWeekStart, setCurrentWeekStart] = useState(
		moment().startOf("week")
	); // Ngày bắt đầu của tuần hiện tại
	const [selectedDate, setSelectedDate] = useState(moment().startOf("day")); // Ngày được chọn
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [getMenu, { data: menu, isLoading, isError }] = useLazyGetMenuQuery();
	const [getRecipe, { data: recipes }] = useLazyGetRecipeListQuery();
	const [createMenu] = useCreateMenuMutation();
	const [deleteMenu] = useDeleteMenuMutation();
	const [isOpenCreateActionSheet, setIsOpenCreateActionSheet] = useState(false);
	const [isOpenEditActionSheet, setIsOpenEditActionSheet] = useState(false);
	const [meal, setMeal] = useState("");
	const [recipeList, setRecipeList] = useState<SelectedRecipe[]>([]);
	const toast = useToast();

	const handleAddRecipe = () => {
		setRecipeList([...recipeList, { recipe_id: "" }]);
	};

	const handleOpenActionSheet = () => {
		setIsOpenCreateActionSheet(true);
		setMeal("");
		setRecipeList([]);
	};

	const handleCloseActionSheet = () => {
		setIsOpenCreateActionSheet(false);
		setMeal("");
		setRecipeList([]);
	};

	const getWeekDays = (startDate: Moment) => {
		return Array.from({ length: 7 }, (_, index) =>
			moment(startDate).add(index, "days")
		);
	};

	const [weekDays, setWeekDays] = useState(getWeekDays(currentWeekStart));

	const handleDayPress = async (day: Moment) => {
		setSelectedDate(day);
		await getMenu({ group_id: groupId, date: day.toISOString() }).unwrap();
	};

	const updateSelector = (value: string, index: number) => {
		const updatedSelectors = [...recipeList];
		updatedSelectors[index].recipe_id = value;
		setRecipeList(updatedSelectors);
	};

	const removeSelector = (index: number) => {
		const updatedList = [...recipeList];
		updatedList.splice(index, 1); // Xóa phần tử tại vị trí 'index'
		setRecipeList(updatedList); // Cập nhật state
	};

	const handleCreateMenu = async () => {
		if (!meal) {
			toast.show("Chưa chọn bữa ăn", { placement: "top", type: "warning" });
			return;
		}
		if (hasDuplicatesOrEmpty(recipeList)) {
			toast.show("Danh sách món ăn không hợp lệ", {
				placement: "top",
				type: "warning",
			});
			return;
		}
		try {
			const payload = {
				group_id: groupId,
				meal: meal,
				date: selectedDate.toISOString(),
				menu_recipe: recipeList,
			};
			await createMenu(payload).unwrap();
			await getMenu({
				group_id: groupId,
				date: selectedDate.toISOString(),
			}).unwrap();
			handleCloseActionSheet();
			toast.show("Tạo thực đơn thành công", {
				placement: "top",
				type: "success",
			});
		} catch (e) {
			console.log(e);
			toast.show("Không thể tạo thực đơn", {
				placement: "top",
				type: "warning",
			});
		}
	};

	const handleDeleteMenu = async (menu_id: string) => {
		try {
			await deleteMenu(menu_id);
			await getMenu({
				group_id: groupId,
				date: selectedDate.toISOString(),
			}).unwrap();
			toast.show("Xóa thực đơn thành công", {
				placement: "top",
				type: "success",
			});
		} catch (e) {
			console.log(e);
			toast.show("Không thể xóa thực đơn", {
				placement: "top",
				type: "warning",
			});
		}
	};

	const renderMenuItem = ({ item }: { item: any }) => (
		<View style={styles.eventCard}>
			{/* Meal Name */}
			<Text style={styles.meal}>{item.meal}</Text>

			<View style={styles.recipes}>
				<Text style={styles.recipeNames}>
					{item.menu_recipe
						.map((menu_recipe: any) => menu_recipe.recipe.name)
						.join(", ")}
				</Text>
			</View>
			<TouchableOpacity
				onPress={(e) => {
					e.stopPropagation();
					handleDeleteMenu(item.id);
				}}
			>
				<Trash2 size={20} color={AppData.colors.danger} />
			</TouchableOpacity>
		</View>
	);

	const renderRecipeList = ({ item, index }: { item: any; index: number }) => (
		<View style={styles.eventCard}>
			<View
				style={{
					width: "80%",
				}}
			>
				<SearchableDropdown
					options={recipeOptions || []}
					placeholder="Chọn món ăn"
					isDisabled={true}
					onSelect={(value) => updateSelector(value, index)}
				/>
			</View>
			<TouchableOpacity
				onPress={() => removeSelector(index)}
				style={styles.trashIcon}
			>
				<Trash2 size={24} color="red" />
			</TouchableOpacity>
		</View>
	);

	useEffect(() => {
		getRecipe({ page: 1, per: 100, search: "" });
		getMenu({ group_id: groupId, date: selectedDate.toISOString() }).unwrap();
	}, [getRecipe]);

	const recipeOptions =
		recipes &&
		recipes.map((recipe: any) => ({
			label: recipe.name, // Dùng name làm label
			value: recipe.id, // Dùng id làm value
		}));

	return (
		<View
			style={{
				...styles.container,
				paddingTop: safeAreaInsets.top,
				paddingBottom: safeAreaInsets.bottom,
				paddingLeft: safeAreaInsets.left,
				paddingRight: safeAreaInsets.right,
			}}
		>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("GROUP_DETAIL", {
							groupId: groupId,
							isAdmin: isAdmin,
						})
					}
				>
					<ArrowLeft size={24} color={AppData.colors.text[900]} />
				</TouchableOpacity>
				<Text style={styles.title}>{"Thực đơn"}</Text>
			</View>
			<Text style={styles.dateText}>
				{`${currentWeekStart.format("DD MMMM")} - ${moment(currentWeekStart)
					.add(6, "days")
					.format("DD MMMM, YYYY")}`}
			</Text>
			{/* Weekly Days */}
			<View style={styles.weekContainer}>
				{weekDays.map((item) => (
					<View key={item.format("YYYY-MM-DD")} style={styles.dayWrapper}>
						<Text style={styles.dayText}>{item.format("ddd")}</Text>
						<TouchableOpacity
							style={[
								styles.dateContainer,
								item.isSame(selectedDate, "day") ? styles.selectedDate : null,
							]}
							onPress={() => handleDayPress(item)}
						>
							<Text style={styles.dateTextSmall}>{item.format("DD")}</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>

			{isLoading ? (
				<ActivityIndicator
					style={styles.centered}
					size="large"
					color="#0000ff"
				/>
			) : isError ? (
				<Text style={styles.errorText}>Failed to load menus.</Text>
			) : menu?.length ? (
				<FlatList
					data={menu}
					renderItem={renderMenuItem}
					keyExtractor={(item, index) => index.toString()}
					contentContainerStyle={styles.container}
				/>
			) : (
				<Text style={styles.noEventsText}>Không có thực đơn cho ngày này</Text>
			)}
			{isAdmin && (
				<TouchableOpacity
					style={styles.fab}
					onPress={() => handleOpenActionSheet()}
				>
					<Plus color="white" size={25} />
				</TouchableOpacity>
			)}
			{isOpenCreateActionSheet && (
				<Actionsheet
					isOpen={isOpenCreateActionSheet}
					onClose={() => handleCloseActionSheet()}
					hideDragIndicator
				>
					<Actionsheet.Content borderTopRadius={24} bottom={bottomInset}>
                    <ScrollView
                            style={{
                                height: "auto",
                                padding: 24,
                                gap: 16,
                                width: "100%",
                            }}
                            showsVerticalScrollIndicator={false}>
                            <View style={{ width: "100%", zIndex: 5 }}>
                                <Text style={{
                                    fontSize: AppData.fontSizes.large,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                    textAlign: "center",
                                }}>
                                    {'Tạo thực đơn'}
                                </Text>
                            </View>
                            <View style={{ width: "100%", zIndex: 4 }}>

                                <SearchableDropdown
                                    options={mealOptions || []}
                                    placeholder="Chọn bữa ăn"
                                    isDisabled={true}
                                    onSelect={(value) => setMeal(value)}
                                />
                            </View>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <Text style={{
                                    fontSize: AppData.fontSizes.medium,
                                    fontWeight: "500",
                                    color: AppData.colors.text[900],
                                }}>
                                    {'Món ăn'}
                                </Text>

                                <TouchableOpacity style={{ marginLeft: 'auto' }}
                                    onPress={() => {
                                        handleAddRecipe()
                                    }}
                                >
                                    <Plus size={26} color={AppData.colors.primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <FlatList
                                    data={recipeList}
                                    renderItem={renderRecipeList}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={styles.container}
                                />
                            </View>
                            <TouchableOpacity style={{
                                padding: 16,
                                height: 60,
                                alignSelf: 'center',
                                backgroundColor: AppData.colors.primary,
                                borderRadius: 16,
                                alignItems: 'center',
                                zIndex: 1,
                                minWidth: 200
                            }}
                                onPress={() => handleCreateMenu()}
                            >
                                <Text style={{
                                    fontSize: AppData.fontSizes.medium,
                                    fontWeight: "500",
                                    color: AppData.colors.text[100],
                                }}>
                                    {'Tạo mới'}
                                </Text>
                            </TouchableOpacity>

                        </ScrollView>
					</Actionsheet.Content>
				</Actionsheet>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		borderBottomColor: "#ccc",
		borderBottomWidth: 0.1,
		fontSize: AppData.fontSizes.large,
		fontWeight: "400",
	},
	title: {
		flex: 1,
		marginLeft: 8,
		fontSize: AppData.fontSizes.large,
		fontWeight: "500",
	},
	centered: { flex: 1, justifyContent: "center", alignItems: "center" },
	errorText: { color: "red" },
	dateText: {
		marginTop: 20,
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	weekContainer: {
		flexDirection: "row",
		marginVertical: 16,
		paddingHorizontal: 8,
	},
	dayWrapper: {
		flex: 1, // Chia đều chiều ngang
		alignItems: "center",
	},
	dayText: {
		fontSize: 12,
		color: "#333",
		marginBottom: 4,
	},
	dateContainer: {
		width: 34, // Kích thước hình tròn
		height: 34,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
	},
	selectedDate: {
		backgroundColor: "#e74c3c",
	},
	dateTextSmall: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000",
	},
	eventsContainer: {
		flex: 1,
		padding: 16,
	},
	noEventsText: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
		marginTop: 16,
	},
	eventCard: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#f8f8f8",
		borderRadius: 8,
		marginBottom: 10,
		marginHorizontal: 16,
		marginVertical: 8,
	},
	trashIcon: {
		marginLeft: 10, // Khoảng cách giữa selector và icon
	},
	meal: {
		fontWeight: "bold",
		fontSize: 16,
		color: "#333",
		width: 100, // Đặt độ rộng cố định hoặc sử dụng flex để canh đều
	},
	recipes: {
		flex: 1,
		paddingLeft: 10,
	},
	recipeNames: {
		fontSize: 14,
		color: "#555",
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
