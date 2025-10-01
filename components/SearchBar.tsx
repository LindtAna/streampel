import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
    return (
        <View className="flex-row items-center bg-dark-200 rounded-full px-3 py-1">
            <Image source={icons.search}
                className="size-5"
                resizeMode="contain" tintColor="#6398ef" />

            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#6398ef"
                className="flex-1 ml2 text-white"
            />
        </View>
    )
}

export default SearchBar