import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { isMovieSaved, removeMovie, saveMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import useAuthStore from "@/store/auth.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";


// Definition des Schnittstellen-Typs MovieInfoProps für die Props des MovieInfo-Komponents
interface MovieInfoProps {
    label?: string,
    value?: string | number | null,
}

// Komponente zur Anzeige von Informationen über den Film
const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className={`flex-col items-start justify-center ${label ? 'mt-5' : ''}`}>
        {label && <Text className="text-light-300 font-normal text-sm">{label}</Text>}
        <Text className="text-white font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
)

// Detaillierte Informationen über den Film
// Abrufen der Navigationsfunktion (router.back für die Rückkehr zum vorherigen Bildschirm)
// Abrufen der Film-ID aus der URL
// useFetch zum Laden der Filmdaten mit fetchMovieDetails
// Lokaler Zustand isSaved — Boolean-Flag, das angibt, ob der Film gespeichert ist
// Lokaler Zustand isToggling — Flag, das Mehrfachklicks während asynchroner Operationen verhindert
const MovieDetails = () => {
const router = useRouter();
const { id } = useLocalSearchParams();
const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string)); 
const { user } = useAuthStore();
const [isSaved, setIsSaved] = useState(false);
const [isToggling, setIsToggling] = useState(false);

// Überprüfung, ob der Film gespeichert ist
// Überprüfung, dass es ein Benutzer und Filmdaten gibt
// Asynchroner Aufruf von isMovieSaved mit der Benutzer-ID und der Film-ID
// Ergebnis (true/false) wird an setIsSaved übergeben
useEffect(() => {
    if (user && movie) {
      isMovieSaved(user.accountId!, movie.id).then(setIsSaved);
    }
  }, [user, movie]);

// Asynchrone Funktion zum Umschalten des Speicherstatus des Films (gespeichert oder nicht)
// Wenn kein Benutzer, kein Film oder isToggling bereits läuft -> nichts tun
// isToggling -> true, um wiederholte Klicks zu verhindern
// Wenn der Film bereits gespeichert ist, wird removeMovie aufgerufen, um ihn zu löschen
// Wenn der Film nicht gespeichert ist, wird saveMovie aufgerufen, um ihn in die Datenbank zu speichern
  const handleSaveToggle = async () => {
    if (!user || !movie || isToggling) return; 
    setIsToggling(true);
    try {
      if (isSaved) {
        await removeMovie(user.accountId!, movie.id);
      } else {
        await saveMovie(user.accountId!, movie);
      }
  

// Erneute Überprüfung des Speicherstatus in der Datenbank, um den Zustand isSaved zu synchronisieren
// Aktualisierung des Zustands isSaved basierend auf dem Ergebnis aus der Datenbank   
      const savedStatus = await isMovieSaved(user.accountId!, movie.id);
      setIsSaved(savedStatus);
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsToggling(false);
    }
  };


 // Rendern des Bildschirms mit den Filmdetails, die Daten stammen von der TMDB API
    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{
                paddingBottom: 60
            }}>
                {/* Container für das Filmplakat */}
                <View> 
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
                        className="w-full h-[550px]"
                        resizeMode="contain" />
                </View>

                {/* Container für Filmdetails + Speicher-Icon */}
                <View className="mt-5 px-5">
                    <View className="flex-row items-center justify-between w-full">
                        <Text className="text-white font-bold text-2xl flex-1 mr-2" numberOfLines={2} ellipsizeMode="tail">
                            {movie?.title}
                        </Text>
                        {/* Bedingung: Wenn der Benutzer authentifiziert ist, wird das Speicher-Icon angezeigt.
                        // TouchableOpacity für ein klickbares Icon, deaktiviert bei isToggling=true 
                        // Gelb (#f6b40a) für gespeichert, Weiß (#faffff) für nicht gespeichert */}
                       {user && (
              <TouchableOpacity onPress={handleSaveToggle} disabled={isToggling}>
                <Image
                  source={icons.saveMovie}
                  className="size-4"
                  tintColor={isSaved ? "#f6b40a" : "#faffff"}
                />
              </TouchableOpacity>
            )}
                    </View>
                    {/* Container für Erscheinungsjahr und Laufzeit */}
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-white text-sm">{movie?.release_date?.split('-')[0]}  • </Text>
                        <Text className="text-white text-sm">{movie?.runtime}Min</Text>
                    </View>
                    {/* Container für Bewertung mit Stern-Icon */}
                    <View className="flex-row items-center mt-2 mb-2">
                        <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1">
                            <Image source={icons.star} className="size-4" />
                            <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average ?? 0)}/10</Text>
                            <Text className="text-white text-sm">({movie?.vote_count} Stimmen)</Text>
                        </View>
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
                    <View className="mb-10">
                        <MovieInfo label="Produktionsfirmen" value={movie?.production_companies.map((c) => c.name).join(' • ') || 'N/A'} />
                    </View>
                </View>
            </ScrollView>

            {/* Klickbare Schaltfläche mit Pfeil-Icon für die Rückkehr zur vorherigen Seite */}
            <View className="w-full px-10 pb-20">
              <CustomButton
                title="Zurück"
                onPress={router.back}
                style="bottom-20" 
                textStyle="mr-2"
                leftIcon={
                    <Image
                        source={icons.arrow}
                        className="size-2 mr-1 mt-0.5 rotate-180"
                        tintColor="#bddeff"
                    />
                }
            />
            </View>
        </View>
    )
}
export default MovieDetails