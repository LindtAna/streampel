import CustomButton from "@/components/CustomButton";
import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { listSavedMovies } from "@/services/appwrite";
import useAuthStore from "@/store/auth.store";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Definition des funktionalen Komponents Saved — Bildschirm zur Anzeige der gespeicherten Filme des Benutzers
// Wenn der Benutzer nicht authentifiziert ist, wird ein Bildschirm für Gäste mit einer Einladung zur Anmeldung angezeigt
const Saved = () => {

  // Array der gespeicherten Filme, initialisiert mit einem leeren Array
  // Wird verwendet, um die Liste der Filme in der FlatList zu speichern und anzuzeigen
  const [movies, setMovies] = useState<any[]>([]);

  // Lokaler Zustand loading — Flag für das Laden von Daten, initialisiert mit false
  // Wird verwendet, um einen Ladeindikator während der Datenbankabfrage anzuzeigen
  const [loading, setLoading] = useState(false);

  // Extrahieren von Daten aus dem Zustand-Authentifizierungs-Store
  // isAuthenticated — Boolean-Flag, das angibt, ob der Benutzer authentifiziert ist
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStore();

  // Hook useFocusEffect — führt Code jedes Mal aus, wenn der Bildschirm fokussiert wird, sorgt für automatische Aktualisierung der Liste gespeicherter Filme
  // useCallback speichert die Funktion im Speicher und gibt dieselbe Version der Funktion zurück; die Funktion wird neu gestartet, wenn sich user oder isAuthenticated ändern
  // user && isAuthenticated -> Überprüfung, dass ein Benutzer existiert und authentifiziert ist — nur dann werden die Daten geladen
  // listSavedMovies mit der ID des Benutzerkontos -> Abrufen der Liste aus der Datenbank
  // .then — bei Erfolg wird der Zustand movies mit dem Array der gespeicherten Filme aktualisiert
  // .finally — setzt den Lade-Flag immer auf false, nachdem die Abfrage abgeschlossen ist
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

  // Bedingung: Wenn die Authentifizierung (authLoading) oder das Laden der Daten (loading) läuft,
  // wird ein einfacher Bildschirm mit dem Text "Loading..." zur Anzeige des Prozesses angezeigt
  if (authLoading || loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-dark-200">
        <Text className="text-white text-base">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Rendern des Bildschirms abhängig vom Authentifizierungsstatus
  return (

    // Hauptcontainer
    <View className="bg-primary flex-1">
      {/* hintergrund */}
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView className="flex-1 px-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}>

        <Image source={icons.logo} className="w-17 h-10 mt-20 mb-5 mx-auto" />
        {/* Bedingtes Rendern: Wenn der Benutzer authentifiziert ist -> Anzeige der Liste gespeicherter Filme;
            sonst — Bildschirm für Gäste */}

        {user && isAuthenticated ? (
          <>
            {/* Verschachtelte Bedingung: Wenn keine gespeicherten Filme vorhanden sind, wird eine Nachricht "keine Filme" angezeigt */}
            {movies.length === 0 ? (
              <>
                <Image source={icons.saveMovie} className="size-10" tintColor="#fff" />
                <Text className="text-gray-500 text-base text-center">
                  Du hast noch keine Filme gespeichert.
                </Text>
              </>
            ) : (
              // Wenn Filme vorhanden sind: FlatList zur Anzeige der Liste in 3 Spalten
              // data — Array movies für das Rendern
              // renderItem — Funktion zum Rendern jeder Filmkarte: Übergibt Daten an MovieCard
              // keyExtractor — eindeutiger Schlüssel für jedes Element (ID des Dokuments aus Appwrite)
              // contentContainerStyle: Stil des Listencontainers
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
                  justifyContent: "center",
                  gap: 15,
                  marginBottom: 10,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
          </>
        ) : (
          <>
            {/* Wenn nicht authentifiziert -> Gast -> Einladung zur Registrierung oder Anmeldung, um Filme zu speichern */}
           <View className="flex-1 flex-col justify-center gap-5 mt-20 pb-10 px-5 items-center">
            <Image source={icons.save} className="size-10" tintColor="#A8B5DB" />
            <Text className="text-light-200 text-base">Saved</Text>
            <Text className="text-light-200 text-base text-center">
              Um Filme zu speichern, melde dich bitte an oder erstelle ein Konto.
            </Text>
            {/* Weiterleitung zur Anmeldeseite */}
            <View className="w-full px-10">
              <CustomButton
                title="Einloggen" onPress={() => router.push("/sign-in")} />
            </View>
            </View>
          </>
        )}

      </ScrollView >
    </View>
  );
};

export default Saved;

