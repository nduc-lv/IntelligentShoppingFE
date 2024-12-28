import React, { useState } from "react";
import { View, Platform } from "react-native";
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

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString(); // Định dạng ngày
            setText(formattedDate); // Cập nhật giá trị ngày vào input
            onChange(selectedDate); // Trả về ngày đã chọn
        }
        setShowPicker(false); // Đóng picker sau khi chọn
    };

    return (
        <View style={{ width: "100%" }}>
            <Pressable
                onPress={() => {
                    setShowPicker(true);
                }}
            >
                <Input
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
                    borderWidth={0.3}
                    _focus={{
                        borderColor: AppData.colors.primary,
                        backgroundColor: "white",
                    }}
                    _disabled={{
                        bgColor: "white", // Giữ nền màu trắng
                        opacity: 1,      // Loại bỏ hiệu ứng mờ
                        borderColor: AppData.colors.text[400], // Giữ màu viền
                    }}
                    InputRightElement={
                        <Pressable onPress={() => setShowPicker(true)}>
                            <Icon
                                as={MaterialIcons}
                                name="date-range"
                                size={5}
                                mr={2}
                                color={AppData.colors.text[400]}
                            />
                        </Pressable>
                    }
                />
            </Pressable>



            {/* Show DateTimePicker only when needed */}
            {showPicker && (
                <DateTimePicker
                    value={new Date()} // Giá trị mặc định là ngày hiện tại
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
