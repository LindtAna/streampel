import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { logout } from "@/services/appwrite";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Profile = () => {
  // Daten aus auth.store extrahieren -> Benutzer, Ladezustand und Authentifizierung
  const { user, isLoading, isAuthenticated, setUser, setIsAuthenticated } = useAuthStore(); 

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-dark-200">
        <Text className="text-white text-base">Loading...</Text> 
      </SafeAreaView>
    );
  }

  return (
    // Hauptcontainer
    <SafeAreaView className="bg-primary flex-1">
      {/* hintergrund */}
      <Image source={images.bg} className="absolute w-full" />

      {/* ampel-logo */}
      <View className="flex-row justify-center mt-20 items-center">
        <Image source={icons.logo} className="w-37 h-15" />
      </View>

      {/* content */}
      <View className="flex justify-center items-center flex-1 flex-col gap-5 px-10">
        {user && isAuthenticated ? (

          // Wenn der Benutzer authentifiziert ist, zeigen wir seine Daten an
          <>
            {/* Avatar aus der Datenbank (Initialen) */}
            <Image
              source={{ uri: user.avatar }} 
              className="w-20 h-20 rounded-full"
            />
           
            <Text className="text-white text-2xl font-bold">{user.name}</Text>
            <Text className="text-gray-500 text-base">{user.email}</Text>


{/* Abmelde-Button: Beendet die Sitzung über Appwrite
 säubert die Benutzerdaten und setzt den Authentifizierungsstatus in auth.store zurück
Leitet zur Anmeldeseite weiter */}
            <CustomButton 
              title="Abmelden" 
              onPress={async () => {
                try {
                  await logout(); 
                  setUser(null); 
                  setIsAuthenticated(false); 
                  router.push("/sign-in"); 
                } catch (error) {
                  console.error('Logout failed:', error); 
                }
              }}
            />
          </>
        ) : (

          // Wenn der Benutzer nicht authentifiziert ist -> Anmeldebildschirm
          <>

            {/* Statisches Icon für nicht authentifizierte Benutzer*/}
            <Image source={icons.guest} className="w-20 h-20"/>
           
            <Text className="text-white text-xl font-bold">♡ willkommen!</Text>
            <Text className="text-gray-500 text-base text-center">
              Um Filme zu speichern und auf dein Profil zuzugreifen, melde dich bitte an oder erstelle ein Konto.
            </Text>

            {/* Weiterleitung zur Anmeldeseite */}
            <CustomButton title="Einloggen" onPress={() => router.push("/sign-in")} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;