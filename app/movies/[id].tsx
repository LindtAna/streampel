import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Interface für die Props des MovieInfo-Komponents
interface MovieInfoProps {
    label?: string,
    value?: string | number | null,
}

// Anzeige von Film-Informationen
const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className={`flex-col items-start justify-center ${label ? 'mt-5' : ''}`}>
        {label && <Text className="text-light-300 font-normal text-sm">{label}</Text>}
        <Text className="text-white font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
)


const MovieDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Extrahiert die Film-ID aus der URL-Parameter
    const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string)); // Verwenden des useFetch-Hooks zum Laden der Filmdetails basierend auf der ID

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{
                paddingBottom: 80
            }}>

                {/* Container für das Filmplakat */}
                <View>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
                        className="w-full h-[550px]"
                        resizeMode="contain" />
                </View>

                {/* Container für Filmdetails */}
                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-2xl">{movie?.title}</Text>

                    {/* Container für Erscheinungsjahr und Laufzeit */}
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-white text-sm">{movie?.release_date?.split('-')[0]}  • </Text>
                        <Text className="text-white text-sm">{movie?.runtime}Min</Text>
                    </View>
{/* Container für Bewertung mit Stern-Icon */}
                    <View className="flex-row items-center bg-dark-100 px-1 py-1 rounded-md gap-x-1 mt-2 mb-2">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average ?? 0)}/10  </Text>
                        <Text className="text-white text-sm">({movie?.vote_count} Stimmen)</Text>
                    </View>
                    {/* Genres, als Liste mit "•" getrennt */}
                    <MovieInfo value={movie?.genres?.map((g) => g.name).join(' • ') || 'N/A'} />
                    <MovieInfo label="Übersicht" value={movie?.overview} />
                    {/* Container für Budget und Einspielergebnis */}
                    <View className=" flex flex-row justify-between w-1/2 gap-10">
                        <MovieInfo
                            label="Budget"
                            value={movie?.budget ? `$${movie.budget / 1_000_000} Millionen` : 'N/A'}
                        />
                        <MovieInfo
                            label="Einspielergebnis"
                            value={movie?.revenue ? `$${Math.round(movie.revenue / 1_000_000)} Millionen` : 'N/A'}
                        />
                    </View>
                    {/* Produktionsfirmen, als Liste mit "•" getrennt */}
                    <MovieInfo label="Produktionsfirmen" value={movie?.production_companies.map((c) => c.name).join(' • ') || 'N/A'} />
                </View>
            </ScrollView>
            {/* Klickbare Schaltfläche für die Rückkehr zur vorherigen Seite */}
            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-dark-200 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}
            >
                <Image
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">Zurück</Text>
            </TouchableOpacity>
        </View>
    )
}
export default MovieDetails