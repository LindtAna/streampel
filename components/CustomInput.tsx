import cn from "clsx";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const CustomInput = (
    { placeholder = 'Enter text',
        value,
        onChangeText,
        label,
        secureTextEntry = false,
        keyboardType = "default" }: CustomInputProps) => {
    const[isFocused, setIsFocused] = useState(false);

    return (

        <View className="w-full">
            <Text className="text-lg text-start w-full font-bold pl-2 text-light-200">{label}</Text>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus = {() => setIsFocused(true)}
                onBlur = {() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor="#9CA4AB"
                className={cn(
        "rounded-lg p-3 w-full font-normal text-light-200 border-b leading-5",
        isFocused ? "border-light-100" : "border-white"
      )}/>
        </View>

    );
};

export default CustomInput;