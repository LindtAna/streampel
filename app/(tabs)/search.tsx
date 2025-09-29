import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
// Zustand zum Speichern der Suchanfrage des Benutzers
    const [searchQuery, setSearchQuery] = useState('');

    // Verwenden des useFetch-Hooks zum Laden von Filmen basierend auf der Suchanfrage
    // fetchMovies wird mit query: searchQuery aufgerufen, der zweite Parameter false deaktiviert autoFetch
    const { data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({
        query: searchQuery
    }), false)

    // useEffect für die Verarbeitung der Suchanfrage mit Verzögerung (Debounce)
    // Timer auf 500 ms, um nicht bei jeder Eingabe Anfragen zu senden
    // Wenn die Anfrage nicht leer ist, wird loadMovies aufrufen
    // Wenn Filme geladen wurden und mindestens ein Film vorhanden ist, wurde die Suchanfrage in Appwrite Database gespeichert
    // Wenn die Anfrage leer ist, wird die Suchergebnisse zurückgesetzt -> reset
    // Timer wird bei Änderung von searchQuery bereinigt

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();   
            } else {
                reset()
            }
        }, 800);

        return () => clearTimeout(timeoutId);

    }, [searchQuery]) // Abhängigkeit von searchQuery: Effekt wird bei Änderung ausgelöst

    useEffect(() => {
 if(movies?.length > 0 && movies?.[0])
         updateSearchCount(searchQuery,movies[0]);
    }, [movies]);

    return (
        <View className="flex-1 bg-primary">

            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />

            <FlatList data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item, index) => (item.id ? item.id.toString() : `fallback-${index}`)} // Schlüssel für Elemente: item.id oder Fallback-Index, wenn id fehlt
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{
                    paddingBottom: 100
                }}

                // Kopfzeile der Liste (Logo, Suchleiste, Ladeindikator, Fehler, Ergebnisse)
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-17 h-10" />
                        </View>

                        <View className="my-5">
                            <SearchBar placeholder="Suche"
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>
                        {loading && (
                            <ActivityIndicator size="large" color="#0000ff" className="my-3" />
                        )}
                        {error && (
                            <Text className="text-red-600 px-5 my-3">Error:{error.message}</Text>
                        )}

                        {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
                            <Text className="text-xl text-white font-bold">
                                Search Results for{' '}
                                <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                // Komponente für leere Liste: Zeigt eine Nachricht, wenn keine Daten geladen werden oder Fehler vorliegen
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-light-200">
                                {searchQuery.trim()
                                    ? "Keine passenden Filme gefunden"
                                    : "Tippe, um nach Filmen zu suchen :)"}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}

export default Search