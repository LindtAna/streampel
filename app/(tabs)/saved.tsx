import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Saved = () => {
  return (
    <SafeAreaView className="bg-primary flex-1"> 
      {/* hitergrund bild */}
      <Image source={images.bg} className="absolute w-full" />

      {/* ampel logo */}
      <View className="flex-row justify-center mt-20 items-center">
        <Image source={icons.logo} className="w-37 h-15" />
      </View>

      {/* content */}
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Image source={icons.save} className="size-10" tintColor="#fff" />
        <Text className="text-gray-500 text-base">Save</Text>
      </View>
    </SafeAreaView>
  );
};

export default Saved;

