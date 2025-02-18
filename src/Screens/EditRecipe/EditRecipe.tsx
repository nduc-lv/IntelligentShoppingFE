import AppData from "@/General/Constants/AppData";
import {
	ArrowLeft,
	Camera,
	ChevronDown,
	Heart,
	Minus,
	Plus,
	ShoppingCart,
} from "lucide-react-native";
import { Actionsheet, TextArea } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/Navigation";
import SearchableDropdown from "@/General/Components/SearchableDropdown";
import { useSelector } from "react-redux";
import {
	useCreateRecipeMutation,
	useLazyGetRecipeQuery,
	useUpdateRecipeMutation,
} from "@/Services/recipe";
import { useCreateFoodMutation } from "@/Services/foodGroup";
import { Toast } from "antd-mobile";
import { useToast } from "react-native-toast-notifications";
import { set } from "lodash";
import ImageUploader from "@/General/Components/ImageUploader";
import useKeyboardBottomInset from "@/General/Hooks/bottominset";

export const EditRecipeScreen = ({ route }: any) => {
	const bottomInset = useKeyboardBottomInset();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [isOpenActionSheet, setIsOpenActionSheet] = useState(false);
	const recipeId = route.params.recipeId;
	const [recipeName, setRecipeName] = useState("");
	const [recipeDescription, setRecipeDescription] = useState("");
	const [recipeInstructions, setRecipeInstructions] = useState("");
	const [recipeIngredients, setRecipeIngredients] = useState<any>([]);
	const { categorys, units, foods } = useSelector((state: any) => state.data);
	const [fetchRecipe, { data: recipe, isLoading, isError, error }] =
		useLazyGetRecipeQuery();
	const [formUnit, setFormUnit] = useState<string>("");
	const [formFood, setFormFood] = useState<string>("");
	const [formQuantity, setFormQuantity] = useState<number>(0);
	const [image_url, setImageUrl] = useState<any>(null);
	const isCreateRecipe = recipeId === "create";
	const [
		createRecipe,
		{ isLoading: isLoadingCreateRecipe, isError: isErrorCreateRecipe },
	] = useCreateRecipeMutation();
	const [
		updateRecipe,
		{ isLoading: isLoadingUpdateRecipe, isError: isErrorUpdateRecipe },
	] = useUpdateRecipeMutation();
	const toast = useToast();

	useEffect(() => {
		if (!isCreateRecipe) fetchRecipe({ recipeId });
	}, []);

	useEffect(() => {
		if (recipe) {
			setRecipeName(recipe?.name);
			setRecipeDescription(recipe?.description);
			setRecipeInstructions(recipe?.instructions);
			setRecipeIngredients(recipe?.foods.rows);
			setImageUrl(recipe?.image_url);
		}
	}, [recipe]);

	const handleCreateRecipe = async () => {
		try {
			await createRecipe({
				name: recipeName,
				description: recipeDescription,
				instructions: recipeInstructions,
				foods: recipeIngredients,
				image_url: image_url,
			})
				.unwrap()
				.then(() => {
					toast.show("Tạo công thức thành công", {
						placement: "top",
						type: "success",
					});
					navigation.goBack();
				});
		} catch (error) {
			toast.show("Tạo công thức không thành công", {
				placement: "top",
				type: "warning",
			});
		}
	};

	const handleUpdateRecipe = async () => {
		try {
			await updateRecipe({
				recipe_id: recipeId,
				name: recipeName,
				description: recipeDescription,
				instructions: recipeInstructions,
				foods: recipeIngredients,
				image_url: image_url,
			})
				.unwrap()
				.then(() => {
					toast.show("Cập nhật công thức thành công", {
						placement: "top",
						type: "success",
					});
					navigation.goBack();
				});
		} catch (error) {
			toast.show("Cập nhật công thức không thành công thông", {
				placement: "top",
				type: "warning",
			});
		}
	};

	const unitOptions =
		units &&
		units.map((unit: any) => ({
			label: unit.name,
			value: unit.name,
		}));

	const foodsOptions =
		foods &&
		foods.map((food: any) => ({
			label: food.name,
			value: food.id,
		}));

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<View style={styles.container}>
				{/* Background image with absolute position */}
				<ImageBackground
					source={{
						uri:
							image_url ||
							"https://i.pinimg.com/236x/62/38/08/6238083cdbed4e1243890eb8f4e53867.jpg",
					}}
					style={styles.backgroundImage}
				>
					<View
						style={{
							padding: 16,
							paddingTop: 32,
							flexDirection: "row",
							width: "100%",
							gap: 16,
						}}
					>
						<TouchableOpacity
							style={{
								height: 48,
								width: 48,
								backgroundColor: AppData.colors.background,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 16,
							}}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<ArrowLeft size={24} color={AppData.colors.text[900]} />
						</TouchableOpacity>

						{/* <TouchableOpacity
                        style={{
                            height: 48,
                            width: 48,
                            backgroundColor: AppData.colors.background,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 16,
                            marginLeft: 'auto'
                        }}
                        onPress={() => {

                        }}
                    >
                        <Camera size={24} color={AppData.colors.text[400]} fill={AppData.colors.text[400]} />
                    </TouchableOpacity> */}

						<ImageUploader onImageUpload={setImageUrl} />
					</View>
				</ImageBackground>
				{/* Content of your screen */}
				<View style={styles.content}>
					<ScrollView
						contentContainerStyle={{ gap: 20, padding: 1 }}
						showsVerticalScrollIndicator={false}
					>
						<View
							style={{
								flexDirection: "column",
								gap: 10,
							}}
						>
							<Text
								style={{
									fontSize: AppData.fontSizes.medium,
									fontWeight: "500",
									color: AppData.colors.text[900],
								}}
							>
								{"Tên công thức"}
							</Text>
							<TextInput
								style={{
									width: "100%",
									fontSize: AppData.fontSizes.medium,
									height: 48, // 12 multiplied by 4 (to match size in dp)
									backgroundColor: "white",
									borderRadius: 8,
									borderColor: AppData.colors.text[400],
									borderWidth: 0.3,
									paddingHorizontal: 10, // Adding horizontal padding for better input feel
								}}
								placeholder="Nhập tên công thức"
								placeholderTextColor={AppData.colors.text[400]}
								onFocus={(e) => {
									e.target.setNativeProps({
										style: {
											borderColor: AppData.colors.primary,
											backgroundColor: "white",
										},
									});
								}}
								onChangeText={setRecipeName}
							/>
						</View>

						<View style={{ gap: 10 }}>
							<Text
								style={{
									fontSize: AppData.fontSizes.medium,
									fontWeight: "500",
									color: AppData.colors.text[900],
								}}
							>
								{"Mô tả"}
							</Text>

							<TextInput
								style={{
									width: "100%",
									fontSize: AppData.fontSizes.medium,
									height: 4 * 24, // 4 lines, 24px each (adjust height as needed)
									backgroundColor: "white",
									borderRadius: 8,
									borderColor: AppData.colors.text[400],
									borderWidth: 0.3,
									padding: 10, // Padding for better user experience
									textAlignVertical: "top", // Align text to the top in multiline
								}}
								placeholder="Nhập mô tả"
								placeholderTextColor={AppData.colors.text[400]}
								multiline={true}
								numberOfLines={4}
								onFocus={(e) => {
									e.target.setNativeProps({
										style: {
											borderColor: AppData.colors.primary,
											backgroundColor: "white",
										},
									});
								}}
								value={recipeDescription}
								onChangeText={setRecipeDescription}
							/>
						</View>

						<View style={{ gap: 10 }}>
							<Text
								style={{
									fontSize: AppData.fontSizes.medium,
									fontWeight: "500",
									color: AppData.colors.text[900],
								}}
							>
								{"Hướng dẫn"}
							</Text>

							<TextInput
								style={{
									width: "100%", // Matches `base: "100%"`
									height: 200, // Explicit height value
									fontSize: AppData.fontSizes.medium,
									backgroundColor: "white",
									borderRadius: 8,
									borderColor: AppData.colors.text[400],
									borderWidth: 0.3,
									padding: 10, // Padding for comfortable input
									textAlignVertical: "top", // Align text to the top for multiline input
								}}
								placeholder="Nhập hướng dẫn"
								placeholderTextColor={AppData.colors.text[400]}
								multiline={true}
								onChangeText={setRecipeInstructions}
								onFocus={(e) => {
									e.target.setNativeProps({
										style: {
											borderColor: AppData.colors.primary,
											backgroundColor: "white",
										},
									});
								}}
							/>
						</View>

						<View style={{ gap: 10 }}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontSize: AppData.fontSizes.medium,
										fontWeight: "500",
										color: AppData.colors.text[900],
									}}
								>
									{"Nguyên liệu"}
								</Text>

								<TouchableOpacity
									style={{ marginLeft: "auto" }}
									onPress={() => {
										setIsOpenActionSheet(true);
									}}
								>
									<Plus size={26} color={AppData.colors.primary} />
								</TouchableOpacity>
							</View>

							{recipeIngredients.map((item: any, index: number) => (
								<View
									key={index}
									style={[
										styles.card,
										{ flexDirection: "row", gap: 16, alignItems: "center" },
									]}
								>
									<View
										style={{
											height: 48,
											width: 48,
											backgroundColor: AppData.colors.background,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											borderRadius: 16,
										}}
									>
										<ImageBackground
											source={{
												uri: "https://i.pinimg.com/736x/80/68/e7/8068e7170f2457e0cbf0c9556caec3e6.jpg",
											}}
											style={StyleSheet.absoluteFillObject}
											imageStyle={{ borderRadius: 16 }}
										></ImageBackground>
									</View>

									<Text
										style={{
											fontSize: AppData.fontSizes.medium,
											fontWeight: "500",
											color: AppData.colors.text[900],
										}}
									>
										{foods &&
											foods.find((food: any) => food.id === item?.food_id)
												?.name}
									</Text>

									<Text
										style={{
											fontSize: AppData.fontSizes.medium,
											fontWeight: "500",
											color: AppData.colors.text[900],
											marginLeft: "auto",
										}}
									>
										{item?.quantity + " " + item?.unit_name}
									</Text>

									<TouchableOpacity
										style={{
											height: 48,
											width: 48,
											backgroundColor: AppData.colors.danger,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											borderRadius: 16,
										}}
										onPress={() => {
											//remove item
											setRecipeIngredients([
												...recipeIngredients.slice(0, index),
												...recipeIngredients.slice(index + 1),
											]);
										}}
									>
										<Minus
											size={24}
											color={AppData.colors.text[100]}
											fill={AppData.colors.text[100]}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>

						<TouchableOpacity
							style={{
								padding: 16,
								// height: 60,
								alignSelf: "center",
								backgroundColor: AppData.colors.primary,
								borderRadius: 16,
								alignItems: "center",
							}}
							onPress={() => {
								if (
									recipeName &&
									recipeDescription &&
									recipeInstructions &&
									recipeIngredients.length > 0
								) {
									if (isCreateRecipe) handleCreateRecipe();
									else handleUpdateRecipe();
								} else {
									toast.show("Hãy nhập đày đủ thông tin", {
										placement: "top",
										type: "warning",
									});
								}
							}}
						>
							<Text
								style={{
									fontSize: AppData.fontSizes.medium,
									fontWeight: "500",
									color: AppData.colors.text[100],
									minWidth: 200,
									textAlign: "center",
								}}
							>
								{"Lưu thay đổi"}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
				{isOpenActionSheet && (
					<Actionsheet
						isOpen={isOpenActionSheet}
						onClose={() => setIsOpenActionSheet(false)}
						hideDragIndicator
						// key={Math.random()}
					>
						<Actionsheet.Content borderTopRadius={24} bottom={bottomInset}>
							<View
								style={{
									height: "auto",
									padding: 24,
									gap: 16,
								}}
							>
								<View style={{ width: "100%", zIndex: 4 }}>
									<SearchableDropdown
										//foodOptions trừ đi các foods đã có trong RecipeIngredients
										// options={foodsOptions || []}
										options={foodsOptions.filter(
											(food: any) =>
												!recipeIngredients.find(
													(ingredient: any) =>
														ingredient?.food_id === food.value
												)
										)}
										placeholder="Tên thực phẩm"
										onSelect={(value) => setFormFood(value)}
										isDisabled={true}
									/>
								</View>
								<View
									style={{
										width: "100%",
										zIndex: 3,
										flexDirection: "row",
										alignItems: "flex-start",
										justifyContent: "space-between",
										gap: 16,
									}}
								>
									<TextInput
										style={{
											width: "40%",
											fontSize: AppData.fontSizes.medium, // Approximate equivalent of size="xl"
											height: 48, // 12 multiplied by 4
											backgroundColor: "white",
											borderRadius: 10,
											marginBottom: "auto",
											borderColor: AppData.colors.text[400],
											borderWidth: 0.3,
											paddingHorizontal: 10, // Adding padding for better input usability
										}}
										placeholder="Số lượng"
										placeholderTextColor={AppData.colors.text[400]}
										keyboardType="numeric" // Show numeric keyboard
										onFocus={(e) => {
											e.target.setNativeProps({
												style: {
													borderColor: AppData.colors.primary,
													backgroundColor: "white",
												},
											});
										}}
										onChangeText={(text) => {
											// Sanitize and validate input to allow only valid decimal numbers
											let sanitizedText = text.replace(/[^0-9.]/g, ""); // Remove invalid characters

											// Add leading zero if input starts with '.'
											if (sanitizedText.startsWith(".")) {
												sanitizedText = "0" + sanitizedText;
											}

											// Prevent multiple dots
											const dotCount = (sanitizedText.match(/\./g) || [])
												.length;
											if (dotCount > 1) {
												return;
											}

											// Parse and update the numeric value
											const numericValue = parseFloat(sanitizedText);
											setFormQuantity(!isNaN(numericValue) ? numericValue : 0);
										}}
									/>

									<View style={{ flex: 1 }}>
										<SearchableDropdown
											options={unitOptions || []}
											placeholder="Đơn vị"
											onSelect={(value) => {
												const unitName = unitOptions.find(
													(item: any) => item.value === value
												)?.label;
												if (unitName) {
													setFormUnit(unitName);
												} else {
													setFormUnit(value);
												}
											}}
										/>
									</View>
								</View>

								<TouchableOpacity
									style={{
										padding: 16,
										height: 60,
										alignSelf: "center",
										backgroundColor: AppData.colors.primary,
										borderRadius: 16,
										alignItems: "center",
										zIndex: 1,
										minWidth: 200,
									}}
									onPress={() => {
										if (formUnit && formFood && formQuantity) {
											setRecipeIngredients([
												...recipeIngredients,
												{
													unit_name: formUnit,
													food_id: formFood,
													quantity: formQuantity,
												},
											]);
											setIsOpenActionSheet(false);
										} else
											toast.show("Hãy nhập đầy đủ thông tin", {
												placement: "top",
												type: "warning",
											});
									}}
								>
									<Text
										style={{
											fontSize: AppData.fontSizes.medium,
											fontWeight: "500",
											color: AppData.colors.text[100],
										}}
									>
										{"Lưu"}
									</Text>
								</TouchableOpacity>
							</View>
						</Actionsheet.Content>
					</Actionsheet>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff", gap: 30 },
	backgroundImage: {
		position: "absolute", // Absolute positioning to cover entire screen
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: "100%",
		height: 300,
	},
	content: {
		flex: 1,
		marginTop: 250,
		padding: 24,
		backgroundColor: "#fff",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		boxShadow: "0px 2px 16px 0px #0633361A",
	},
	card: {
		backgroundColor: "#fff",
		padding: 4,
		borderRadius: 16,
		boxShadow: "0px 2px 8px 0px #0633361A",
		borderWidth: 1, // Độ dày của vạch kẻ
		borderColor: "#0633361A", // Màu sắc của vạch kẻ
	},
});
