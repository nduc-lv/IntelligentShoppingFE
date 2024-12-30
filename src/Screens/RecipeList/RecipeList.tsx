import { Group, useLazyGetAllGroupQuery } from "@/Services/group";
import {
	ArrowRight,
	Clock,
	Clock5,
	Heart,
	Notebook,
	NotebookText,
	ScrollText,
	Search,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	Image,
	ImageBackground,
	ScrollView,
	TextInput,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import AppData from "@/General/Constants/AppData";
import { Avatar, Input } from "native-base";
import App from "App";
import Globals from "@/General/Constants/Globals";
import {
	useLazyGetRecipeListQuery,
	useSaveRecipeMutation,
	useUnsaveRecipeMutation,
} from "@/Services/recipe";
import { Toast } from "antd-mobile";
import { useToast } from "react-native-toast-notifications";
import { useDebounce } from "use-debounce";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";

export const RecipeListScreen = () => {
	const [filters, setFilters] = useState(Globals.gFilterRecipeList);
	const [fetchRecipe, { data: recipes, isLoading, isError, error }] =
		useLazyGetRecipeListQuery();
	const [saveRecipe, { data: savedRecipe }] = useSaveRecipeMutation();
	const [unSavedRecipe, { data: unsavedRecipe }] = useUnsaveRecipeMutation();
	const [food_recipes, setFoodRecipes] = useState<any>([]);
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [search, setSearch] = useState("");
	const [searchQuery] = useDebounce(search, 500);

	const toast = useToast();
	useEffect(() => {
		const unsubscribeFocus = navigation.addListener("focus", () => {
			fetchRecipe(filters);
		});
		return unsubscribeFocus;
	}, []);
	useEffect(() => {
		fetchRecipe({ ...filters, search: searchQuery });
	}, [searchQuery]);
	useEffect(() => {
		if (search) {
			fetchRecipe({ ...filters, search: searchQuery });
		}
	}, [filters]);

	useEffect(() => {
		if (recipes) setFoodRecipes(recipes[0]?.food_recipes);
	}, [recipes]);

	const handleSaveRecipe = async (recipeId: string) => {
		try {
			await saveRecipe({ recipe_id: recipeId }).unwrap();
			fetchRecipe(filters);
		} catch (e) {
			console.log(e);
			toast.show("Không thể lưu công thức", {
				placement: "top",
				type: "warning",
			});
		}
	};

	const handleUnSavedRecipe = async (recipeId: string) => {
		try {
			await unSavedRecipe({ recipe_id: recipeId }).unwrap();
			fetchRecipe(filters);
		} catch (e) {
			console.log(e);
			toast.show("Không thể bỏ lưu công thức", {
				placement: "top",
				type: "warning",
			});
		}
	};
	const renderRecipeItem = ({ item }: { item: any }) => (
		// console.log('index1', item.id),
		<TouchableOpacity
			key={Math.random()}
			style={[styles.card, { width: 250, height: 270 }]}
			onPress={() =>
				navigation.navigate("RECIPE_DETAIL", {
					recipeId: item.id,
					isMyRecipe: false,
				})
			}
		>
			<ImageBackground
				source={{
					uri:
						item?.image_url ||
						"https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg",
				}}
				style={StyleSheet.absoluteFillObject}
				imageStyle={{ borderRadius: 16 }}
			>
				<TouchableOpacity
					style={{
						height: 52,
						width: 52,
						backgroundColor: AppData.colors.background,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 16,
						position: "absolute",
						top: 16,
						left: 16,
					}}
					onPress={(e) => {
						e.stopPropagation();
						setFoodRecipes(item?.food_recipes);
					}}
				>
					<ScrollText size={32} color={AppData.colors.primary} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						height: 52,
						width: 52,
						backgroundColor: AppData.colors.background,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 16,
						position: "absolute",
						top: 16,
						right: 16,
					}}
					onPress={(e) => {
						e.stopPropagation();
						if (item?.isSaved) handleUnSavedRecipe(item.id);
						else handleSaveRecipe(item.id);
					}}
				>
					{item?.isSaved ? (
						<Heart
							size={32}
							color={AppData.colors.primary}
							fill={AppData.colors.primary}
						/>
					) : (
						<Heart
							size={32}
							color={AppData.colors.text[400]}
							fill={AppData.colors.text[400]}
						/>
					)}
				</TouchableOpacity>

				<View
					style={{
						marginTop: "auto",
						padding: 16,
						gap: 10,
					}}
				>
					<Text
						style={{
							fontSize: AppData.fontSizes.large,
							fontWeight: "600",
							color: AppData.colors.text[100],
						}}
					>
						{item.name}
					</Text>

					<View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Clock5 size={20} color={AppData.colors.text[400]} />
							<Text
								style={{
									fontSize: AppData.fontSizes.default,
									fontWeight: "400",
									color: AppData.colors.text[400],
									marginLeft: 5,
								}}
							>
								{"40 min"}
							</Text>
						</View>

						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<NotebookText size={20} color={AppData.colors.text[400]} />
							<Text
								style={{
									fontSize: AppData.fontSizes.default,
									fontWeight: "400",
									color: AppData.colors.text[400],
									marginLeft: 5,
								}}
							>
								{item?.food_recipes?.length}
							</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);

	const renderIngredientItem = ({
		item,
		index,
	}: {
		item: any;
		index: number;
	}) => (
		// console.log('index2', index),
		<View
			key={Math.random()}
			style={{
				width: 200,
				marginRight: 16,
			}}
		>
			<ImageBackground
				source={{
					uri:
						item?.food?.image_url ||
						"https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg",
				}}
				style={{
					width: "100%",
					height: 150,
				}}
				imageStyle={{ borderRadius: 16 }}
			/>
			<Text
				style={{
					fontSize: AppData.fontSizes.medium,
					fontWeight: "600",
					color: AppData.colors.text[900],
					marginTop: 8,
					textAlign: "center",
				}}
			>
				{item?.food?.name}
			</Text>
		</View>
	);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: "white",
						borderRadius: 16,
						borderWidth: 0.3,
						borderColor: "#fff",
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.2,
						shadowRadius: 1,
						elevation: 1,
						flex: 1,
						height: 64, // Approximate height={16} with XL sizing
					}}
				>
					<Search
						style={{ marginLeft: 15 }}
						size={28}
						color={AppData.colors.primary}
					/>
					<TextInput
						style={{
							flex: 1,
							fontSize: 18, // Approximate size={"xl"}
							color: "#000",
							padding: 10,
							backgroundColor: "white",
							borderRadius: 16,
						}}
						placeholder="Tìm kiếm"
						placeholderTextColor="#aaa"
						value={search}
						onChangeText={setSearch}
					/>
				</View>
				<TouchableOpacity
					style={{
						height: 64,
						width: 64,
						backgroundColor: AppData.colors.primary,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 16,
						marginLeft: 16,
					}}
					onPress={() => {
						setFilters({ ...filters, search: search });
					}}
				>
					<ArrowRight color="white" />
				</TouchableOpacity>
			</View>

			<View>
				<Text style={styles.title}>{"Đề xuất món ăn"}</Text>
				<FlatList
					data={recipes}
					renderItem={renderRecipeItem}
					horizontal
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: 16 }}
					showsHorizontalScrollIndicator={false}
				/>
			</View>

			<View>
				<Text style={styles.title}>{"Nguyên liệu"}</Text>
				<FlatList
					data={food_recipes}
					renderItem={renderIngredientItem}
					horizontal
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: 16 }}
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 30 },
	title: {
		fontSize: AppData.fontSizes.large,
		fontWeight: "500",
		color: AppData.colors.text[900],
		marginBottom: 16,
	},
	card: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 16,
		boxShadow: "0px 2px 16px 0px #0633361A",
	},
});
