import CustomButton from "@/components/CustomButton";
import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { listSavedMovies } from "@/services/appwrite";
import useAuthStore from "@/store/auth.store";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

////TODO -> Fixen die Anzeige der Filmeliste !
const Saved = () => {

const [movies, setMovies] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

  // Daten aus auth.store extrahieren -> Benutzer, Ladezustand und Authentifizierung
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStore();

 useFocusEffect(
    useCallback(() => {
      if (user && isAuthenticated) {
        setLoading(true);
        listSavedMovies(user.accountId!)
          .then((saved) => setMovies(saved))
          .finally(() => setLoading(false));
      }
    }, [user, isAuthenticated])
  );

  if (authLoading || loading) {
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
      <View className="flex-row justify-center mt-20 pb-5 items-center">
        <Image source={icons.logo} className="w-37 h-15" />
      </View>

      {/* content */}
      <View className="flex justify-center items-center flex-1 flex-col gap-5 px-10">
        {user && isAuthenticated ? (



          // Wenn der Benutzer authentifiziert ist, zeigen wir gespeicherte Filme
          <>
                {movies.length === 0 ? (
                  <>
                    <Image source={icons.saveMovie} className="size-10" tintColor="#fff" />
                    <Text className="text-gray-500 text-base text-center">
                      Du hast noch keine filme gespeichert.
                    </Text>
                  </>
                ) : (
                  <FlatList
                data={movies}
                renderItem={({ item }) => (
                  <MovieCard
                    id={item.movieId}
                    title={item.title}
                    vote_average={item.vote_average}
                    release_date={item.release_date}
                    poster_path={item.posterPath}
                    adult={false}
                    backdrop_path={""}
                    genre_ids={[]}
                    original_language={""}
                    original_title={""}
                    overview={""}
                    popularity={0}
                    video={false}
                    vote_count={0}
                  />
                )}
                keyExtractor={(item) => item.$id}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  padding: 5,
                  marginBottom: 10,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
          </>
        ) : (
          <>
            <Image source={icons.saveMovie} className="size-10" tintColor="#fff" />
            <Text className="text-gray-500 text-base">Saved</Text>
            <Text className="text-gray-500 text-base text-center">
              Um Filme zu speichern, melde dich bitte an oder erstelle ein Konto.
            </Text>
            {/* Weiterleitung zur Anmeldeseite */}
            <CustomButton title="Einloggen" onPress={() => router.push("/sign-in")} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Saved;

