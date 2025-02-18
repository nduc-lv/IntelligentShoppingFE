import React, { useEffect, useState } from "react";
import { View, Platform, TouchableOpacity, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input, Pressable, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"; // Hoặc bất kỳ bộ icon nào bạn sử dụng
import AppData from "@/General/Constants/AppData";

interface DateTimePickerInputProps {
	onChange: (date: Date | null) => void;
	placeholder?: string;
}

const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
	onChange,
	placeholder = "Chọn ngày",
}) => {
	const [showPicker, setShowPicker] = useState(false);
	const [text, setText] = useState("");
	const [date, setDate] = useState(new Date());

	const handleDateChange = (event: any, selectedDate: Date | undefined) => {
		if (selectedDate) {
      		setDate(selectedDate)
			const formattedDate = selectedDate.toLocaleDateString(); // Định dạng ngày
			setText(formattedDate); // Cập nhật giá trị ngày vào input
			onChange(selectedDate); // Trả về ngày đã chọn
		}
	};
	useEffect(()=>{
		let sub=Keyboard.addListener('keyboardWillShow',()=>{setShowPicker(false)})
		return ()=>{
			sub.remove()
		}
	},[])
	useEffect(()=>{
		if(showPicker){
			Keyboard.dismiss()
		}
	},[showPicker])
	return (
		<View style={{ width: "100%" }}>
			<TouchableOpacity
				onPress={() => {
					setShowPicker((val) => !val);
				}}
			>
				<Input
					pointerEvents="none"
					value={text}
					placeholder={placeholder}
					onChangeText={(val) => setText(val)} // Cho phép người dùng nhập
					width={"100%"}
					w={{ base: "100%" }}
					size={"xl"}
					height={12}
					bgColor="white"
					isDisabled
					borderRadius={10}
					borderColor={AppData.colors.text[900]}
					fontSize={AppData.fontSizes.medium}
					borderWidth={0.3}
					_focus={{
						borderColor: AppData.colors.primary,
						backgroundColor: "white",
					}}
					_disabled={{
						bgColor: "white", // Giữ nền màu trắng
						opacity: 1, // Loại bỏ hiệu ứng mờ
						borderColor: AppData.colors.text[400], // Giữ màu viền
					}}
					InputRightElement={
						<TouchableOpacity onPress={() => setShowPicker((val) => !val)}>
							<Icon
								as={MaterialIcons}
								name="date-range"
								size={5}
								mr={2}
								color={AppData.colors.text[400]}
							/>
						</TouchableOpacity>
					}
				/>
			</TouchableOpacity>

			{/* Show DateTimePicker only when needed */}
			{showPicker && (
				<DateTimePicker
        			textColor={AppData.colors.text[900]}
					themeVariant={"light"}
					value={date} // Giá trị mặc định là ngày hiện tại
					mode="date" // Chế độ chọn ngày
					display={Platform.OS === "ios" ? "spinner" : "default"} // Hiển thị dạng spinner hoặc modal
					onChange={handleDateChange}
					minimumDate={new Date()}
				/>
			)}
		</View>
	);
};

export default DateTimePickerInput;
