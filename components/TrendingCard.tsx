import { images } from "@/constants/images";
import MaskedView from '@react-native-masked-view/masked-view';
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";


const TrendingCard = ({ movie: { movie_id, title, poster_url }, index }: TrendingCardProps) => {
    return (
        //  Link für die Navigation zur Filmseite basierend auf movie_id
        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity className="w-32 relative mx-2">
                <Image source={{ uri: poster_url }}
                    className="w-32 h-44 rounded-lg"
                    resizeMode="cover"
                />
                <View className="absolute bottom-10 rounded-full">
                    <MaskedView maskElement={
                        // Rangnummer 
                        <Text className="font-bold text-light-100 text-7xl">{index + 1}
                        </Text>
                    }>

                        <Image source={images.rankingGradient}
                            className="size-24"
                            resizeMode="cover" />

                    </MaskedView>
                </View>
                <Text className="text-sm font-bold mt-2 text-white"
                    numberOfLines={2}>
                    {title}
                </Text>
            </TouchableOpacity>
        </Link>
    )
}

export default TrendingCard

//docs about component that renders a masked view
//https://www.npmjs.com/package/@react-native-masked-view/masked-view?activeTab=readme