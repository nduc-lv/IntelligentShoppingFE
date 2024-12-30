import React, { useEffect, useState } from "react";
import { Input, FlatList, Pressable, Text, Icon } from "native-base";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput } from
"react-native";
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
			<View
        style={
        {


          // width: "100%",
          // position: "relative"
        }}>
				{/* Input Field */}
				<Pressable
          onPress={() => {
            if (isDisabled) {
              setShowDropdown((val) => !val); // Mở dropdown khi `isDisabled` bật
            }
          }}>

					<View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 10,
              borderWidth: 0.3,
              borderColor: AppData.colors.text[400],
              height: 48 // Approximate height=12 with 'xl' size
            }}>

						<TextInput
              {...isDisabled ? { pointerEvents: "none" } : {}}
              style={{
                flex: 1,
                fontSize: AppData.fontSizes.medium,
                paddingHorizontal: 10,
                backgroundColor: "white",
                borderRadius: 10
              }}
              placeholder={placeholder}
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                setShowDropdown(true); // Open dropdown when typing
                if (!filteredOptions.find((option) => option.label === text)) {
                  console.log("filteredOptions", text);
                  onSelect(text);
                } else {
                  console.log("filteredOptions", filteredOptions);
                }
              }}
              onFocus={() => setShowDropdown((val) => !val)} // Open dropdown on focus
              editable={!isDisabled} />

						<View style={{ marginRight: 10 }}>
							{searchTerm.length > 0 ?
              <Pressable onPress={clearText}>
									<CircleX size={20} color={AppData.colors.text[500]} />
								</Pressable> :

              <Pressable onPress={() => setShowDropdown(!showDropdown)}>
									<ChevronDown size={20} color={AppData.colors.text[500]} />
								</Pressable>
              }
						</View>
					</View>
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
            fontSize={AppData.fontSizes.medium}
            color={AppData.colors.text[500]}>

								<Text>{item.label}</Text>
							</Pressable>
          }
          style={{
            position: "absolute", // Make dropdown float above the input
            top: "100%", // Position dropdown below input
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderColor: "#ccc",
            borderWidth: 1,
            zIndex: 1, // Ensure dropdown stays above other elements
            maxHeight: 150,
            marginTop: 5 // Small gap between input and dropdown
          }} />

        }
			</View>
		</TouchableWithoutFeedback>);

};

export default SearchableDropdown;