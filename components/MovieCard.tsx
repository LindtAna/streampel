import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Props -> Daten eines Films aus der TMDb-API
const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
    return (
       // asChild übergibt die Steuerung an das child-Element (TouchableOpacity), um Klicks zu verarbeiten
       //* TouchableOpacity -> klickbare Karte mit einem Schattensseffekt beim Drücken w-[30%] - 30% der Breite des Parent-Containers
        // Wenn es poster_path gibt, wird die TMDb-URL verwendet, sonst placeholder
       <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className="w-[30%]">
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : 'https://dummyimage.com/200x400/0f0D23/6398ef.png&text=No+Poster+Available'
                           
                            // 0f0D23/6398ef
                    }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                />
                {/* Zeigt den Filmtitel an
                numberOfLines schneidet lange Titel auf eine Zeile */}
                <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>{title}</Text> 
                {/* View für die Bewertung (Stern-Symbol + Bewertungszahl) */}
                <View className="flex-row items-center justify-start gap-x-1" >
                    <Image source={icons.star} className="size-4" />
                    <Text className="text-ss text-white font-bold uppercase">{Math.round(vote_average / 2)}</Text>
                </View>

                 {/*View für das Erscheinungsjahr */}
                <View className="flex-row items-center justify-between">
                    {/* release_date wird an '-' (2025-01-21) geteilt und das erste Element (Jahr) wird verwendet */}
                    <Text className="text-xs text-light-300 font-medium mt-1">{release_date?.split('-')[0]}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard

// poster_path: https://developer.themoviedb.org/docs/image-basics

//https://dummyimage.com/200x400/0f0D23/6398ef.png&text=No+Poster+Available -> generiert von https://dummyimage.com/

// damit Tailwind Image im /components verarbeiten kann, muss in tailwind.config.js in content die Zeile für "./components/**/*.{js,jsx,ts,tsx}" hinzugefügt werden

// props from TMDB(response)
//Beispiel
// {
//   "page": 1,
//   "results": [
//     {
//       "adult": false,
//       "backdrop_path": "/zcwEuzsG2vEZkKyScc63wWZf8Yv.jpg",
//       "genre_ids": [
//         878,
//         12
//       ],
//       "id": 617126,
//       "original_language": "en",
//       "original_title": "The Fantastic 4: First Steps",
//       "overview": "Against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel's First Family is forced to balance their roles as heroes with the strength of their family bond, while defending Earth from a ravenous space god called Galactus and his enigmatic Herald, Silver Surfer.",
//       "popularity": 619.3357,
//       "poster_path": "/x26MtUlwtWD26d0G0FXcppxCJio.jpg",
//       "release_date": "2025-07-22",
//       "title": "The Fantastic 4: First Steps",
//       "video": false,
//       "vote_average": 7.2,
//       "vote_count": 1429
//     },
//     {
//       "adult": false,
//       "backdrop_path": "/1RgPyOhN4DRs225BGTlHJqCudII.jpg",
//       "genre_ids": [
//         16,
//         28,
//         14,
//         53
//       ],
//       "id": 1311031,
//       "original_language": "ja",
//       "original_title": "劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来",
//       "overview": "The Demon Slayer Corps are drawn into the Infinity Castle, where Tanjiro, Nezuko, and the Hashira face terrifying Upper Rank demons in a desperate fight as the final battle against Muzan Kibutsuji begins.",
//       "popularity": 580.5478,
//       "poster_path": "/sUsVimPdA1l162FvdBIlmKBlWHx.jpg",
//       "release_date": "2025-07-18",
//       "title": "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
//       "video": false,
//       "vote_average": 7.796,
//       "vote_count": 353
//     }
// } ... etc