
import React, { useEffect, useState } from "react";
import { Input, FlatList, Pressable, Text, Icon } from "native-base";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import AppData from "@/General/Constants/AppData";
import { Check, ChevronDown, CircleX } from "lucide-react-native";

interface Option {
  label: string,
  value: string, }


interface SearchableDropdownProps {
  options: Option[],
  placeholder?: string,
  onSelect: (value: string) => void,
  isDisabled?: boolean, }


const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  placeholder = "Search...",
  onSelect,
  isDisabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = options.filter((option) =>
  option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log('filteredOptions2', filteredOptions);

  const handleSelect = (item: Option) => {
    onSelect(item.value);
    setSearchTerm(item.label);
    setShowDropdown(false); // Đóng dropdown
    Keyboard.dismiss(); // Ẩn bàn phím
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const clearText = () => {
    setSearchTerm(""); // Xóa hết text trong ô input
    setShowDropdown(false); // Đóng dropdown khi xóa
    Keyboard.dismiss(); // Ẩn bàn phím
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
            <View style={{
        width: "100%",
        position: "relative"
      }}>
                {/* Input Field */}
                <Pressable
          onPress={() => {
            if (isDisabled) {
              setShowDropdown(true); // Mở dropdown khi `isDisabled` bật
            }
          }}>

                    <Input
            placeholder={placeholder}
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              setShowDropdown(true); // Mở dropdown khi tìm kiếm

              if (!filteredOptions.find((option) => option.label === text)) {
                onSelect(text);
                setShowDropdown(false);
              }
            }}
            onFocus={() => setShowDropdown(true)} // Mở dropdown khi focus
            w={{ base: "100%"}}
            size={"xl"}
            height={12}
            bgColor="white"
            isDisabled={isDisabled}
            borderRadius={10}
            borderColor={AppData.colors.text[400]}
            borderWidth={0.3}
            _focus={{
              borderColor: AppData.colors.primary,
              backgroundColor: 'white'
            }}
            _disabled={{
              bgColor: 'white', // Giữ nền màu trắng
              opacity: 1, // Loại bỏ hiệu ứng mờ
              borderColor: AppData.colors.text[400] // Giữ màu viền
            }}
            InputRightElement={
            // Thêm biểu tượng "clear" (dấu bằng) bên phải
            <>
                                {searchTerm.length > 0 ?
              <Pressable
                style={{ marginRight: 10 }}
                onPress={clearText}>
                                        <CircleX size={20} color={AppData.colors.text[500]} />
                                    </Pressable> :

              <Pressable style={{ marginRight: 10 }}
              onPress={() => setShowDropdown(!showDropdown)}>

                                        <ChevronDown size={20} color={AppData.colors.text[500]} />
                                    </Pressable>
              }
                            </>
            }
            pointerEvents={isDisabled ? 'none':'auto'} // Chặn sự kiện trên input khi disable
          />
                </Pressable>


                {/* Dropdown List */}
                {showDropdown &&
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          // showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
          <Pressable
            onPress={() => handleSelect(item)}
            p="3"
            borderBottomWidth={1}
            borderColor="coolGray.200"
            fontSize={AppData.fontSizes.small}
            color={AppData.colors.text[500]}>

                                <Text>{item.label}</Text>
                            </Pressable>
          }
          style={{
            // position: "absolute", // Đặt dropdown lên trên input
            // top: "100%", // Dưới input
            // left: 0,
            // right: 0,
            backgroundColor: "white",
            borderColor: "#ccc",
            borderWidth: 1,
            zIndex: 1, // Đảm bảo dropdown nằm trên các phần tử khác
            maxHeight: 150
          }} />

        }
            </View>
        </TouchableWithoutFeedback>);

};

export default SearchableDropdown;