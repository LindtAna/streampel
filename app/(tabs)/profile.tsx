import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import * as Sentry from '@sentry/react-native';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Account, Client } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";


const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("YOUR_PROJECT_ID"); // Replace with your Appwrite project ID

const account = new Account(client);

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-dark-200">
        <Text className="text-white text-base">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
   
    <SafeAreaView className="bg-primary flex-1">
      {/* hintedgrund bild! */}
      <Image source={images.bg} className="absolute w-full" />

      {/* ampel logo */}
      <View className="flex-row justify-center mt-20 items-center">
        <Image source={icons.logo} className="w-37 h-15" />
      </View>

      {/* profile content */}
      <View className="flex justify-center items-center flex-1 flex-col gap-5 px-10">
        {user ? (
          <>
            <Image
              source={icons.person}
              className="w-20 h-20 rounded-full"
              tintColor="#fff"
            />
            <Text className="text-white text-2xl font-bold">{user.name}</Text>
            <Text className="text-gray-500 text-base">{user.email}</Text>
          </>
        ) : (
          <>
            <Image source={icons.person} className="w-20 h-20" tintColor="#fff" />
            <Text className="text-white text-xl font-bold">Welcome!</Text>
            <Text className="text-gray-500 text-base text-center">
              Um Filme zu speichern und auf dein Profil zuzugreifen, melde dich bitte an oder erstelle ein Konto.
            </Text>
            <CustomButton title="Einloggen" onPress={() => router.push("/sign-in")} />
    
          </>


        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;

