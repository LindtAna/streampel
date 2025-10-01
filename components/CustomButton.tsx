import cn from "clsx";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
}

const CustomButton = ({
    onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading= false}: CustomButtonProps) => {

  return (
   <TouchableOpacity className="bg-dark-200 rounded-full p-3 w-full flex flex-row justify-center" onPress={onPress}>
    {leftIcon}
    <View className="flex items-center justify-center flex-row">
{isLoading ? (
  <ActivityIndicator size="small" color="white" />
): (
<Text className={cn('color-light-100 font-semibold text-base', textStyle)}>
                        {title}
                    </Text>
)}
    </View>

   </TouchableOpacity>
    
  )
}

export default CustomButton;