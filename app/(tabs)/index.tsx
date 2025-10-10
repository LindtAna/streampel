import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import useAuthStore from "@/store/auth.store";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {
  
const { user } = useAuthStore();

  const router = useRouter();

  // Verwenden des useFetch-Hooks zum Laden der Trendfilme aus Appwrite-Datenbank
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrendingMovies);

  // Verwenden des useFetch-Hooks zum Laden der neuesten Filme über die TMDb-API
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }))


  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
        nestedScrollEnabled={true}>

        <Image source={icons.logo} className="w-17 h-10 mt-20 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center" />

            //  Fehleranzeige für beide Datenquellen (TMDb oder Appwrite)
        ) : moviesError || trendingError ? ( 
          <Text>Error:{moviesError?.message || trendingError?.message} </Text>
        ) : <View className="flex-1 mt-5">
          {/* <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Suche"
          /> */}

           {/* Container für die Überschrift der Trendfilme */}
          {trendingMovies && (
            <View className="mt-10">
              <Text className="text-lg text-light-200 font-bold mb-3">Populäre Filme</Text>
            </View>
          )}

          <>
            <FlatList className="mb-4 mt-3 horizontal-flatlist"
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              ItemSeparatorComponent={() => <View className="w-4" />}
              data={trendingMovies}
              renderItem={({ item, index }) => (
                 <TrendingCard movie={item} index={index} />
              )}
              keyExtractor={(item) => item.movie_id.toString()}
              contentContainerStyle={{ paddingHorizontal: 4, minWidth: "100%" }}
            style={{ flexGrow: 0, overflowX: "auto", width: "100%", minWidth: 0 }}
            />
            <Text className="text-lg text-light-200 font-bold mt-5 mb-3"
            >Neuerscheinungen</Text>
            <FlatList
              data={movies}
              renderItem={({ item }) => (
                <MovieCard
                  {...item}
                />
              )}
              keyExtractor={(item, index) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={
                {
                  justifyContent: 'flex-start',
                  gap: 15,
                  marginBottom: 10
                }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </>
        </View>
        }
      </ScrollView>
    </View>
  );
}



// https://reactnative.dev/docs/flatlist