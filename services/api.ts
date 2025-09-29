// Objekt, enthält Konfigurationsdaten für die Arbeit mit der TMDB API
// Basis-URL für alle Anfragen an die TMDB API
// Alle API-Endpunkte beginnen mit dieser Adresse, wird zur Bildung vollständiger URLs verwendet
// API-Schlüssel aus .env holen (für Sicherheit)
// process.env ermöglicht das dynamische Laden von Umgebungsvariablen beim Start der Anwendung 
export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3/',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,

// Kopfzeilen, die mit jeder Anfrage an die API gesendet werden, Antwort im JSON-Format
// Bilden der Authorization-Kopfzeile mit einem Bearer-Token
// TMDB API erfordert Autorisierung über Bearer-Token für den Datenzugriff
// Token wird aus der Umgebungsvariable geladen, um ihn nicht im Code zu duplizieren
headers: {  
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
       },
   };


// Funktion zum Abrufen populärer Filme oder zur Durchführung einer Suche nach einer Anfrage
// Akzeptiert ein Objekt mit dem Parameter query (Suchstring, optional)
// Wenn query vorhanden ist, verwenden wir den Suchendpunkt für Filme mit dem Parameter query
// Wenn query fehlt, fordern wir eine Liste populärer Filme an, sortiert nach Popularität
export const fetchMovies = async({query}
    : {query: string}) => {
     const endpoint = query
 ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
 
 : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;


// Führen eine HTTP-Anfrage mit der Methode GET an den gebildeten Endpunkt aus
// Übergeben Kopfzeilen aus TMDB_CONFIG für Autorisierung und Antwortformat
 const response = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers,
 });


// Fehler mit Statustext, wenn ein Problem auftritt
// @ts-ignore deaktiviert die TypeScript-Prüfung für Typisierung
if(!response.ok){
    //@ts-ignore
    throw new Error('Failed to fetch movies!!', response.statusText );
 }

// Parsen der Serverantwort im JSON-Format
// TMDB API gibt ein Objekt mit dem Feld results zurück
// Geben ein Array von Filmen aus der Eigenschaft results zurück
const data = await response.json();
return data.results;

}


export const fetchMovieDetails = async(movieId: string): Promise<MovieDetails> => {
try{
const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
    {method: 'GET',
     headers: TMDB_CONFIG.headers,
    }
);

if(!response) throw new Error('Failed to fetch movie details!');

const data = await response.json();

return data;

}catch(error){
    console.log(error);
    throw(error);
}


}



// пример прямого запроса к TMDB API без использования конфигурации
// демонстрирует, как можно выполнить запрос вручную
// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmVkNzBiYzc3ZWU1NDk4NjllNmE5YTc1NGNlNTcwMCIsIm5iZiI6MTc1ODgwNDk1MC4xODksInN1YiI6IjY4ZDUzYmQ2ZDgxZjI5NGVmZTViMTUyMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vd2tQInC4CeNJMAQV85hj2CghkdTkB6cPX5CZb6k-es'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));


// Das brauche ich, da auf meiner Muttersprache verstehe ich es bisher besser :) 
// // объект, содержит конфигурационные данные для работы с TMDB API
// export const TMDB_CONFIG = {
//     // Базовый URL для всех запросов к TMDB API
//     // все эндпоинты API начинаются с этого адреса, используется для формирования полных URL
//     BASE_URL: 'https://api.themoviedb.org/3/',

//     // Получаем API-ключ из .env (для обеспечения безопасности)
//     // process.env позволяет динамически подтягивать переменные окружения при запуске приложения
//     API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,

// // заголовки, которые будут отправляться с каждым запросом к API,ответ в формате JSON
//     headers: {  
//         accept: 'application/json',
//         // Формируем заголовок Authorization с использованием Bearer токена
//         // TMDB API требует авторизацию через Bearer токен для доступа к данным
//         // Токен подтягивается из переменной окружения, чтобы не дублировать его в коде
//         Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`

//     }
// }

// // Функция для получения популярных фильмов или выполнения поиска по запросу
// // Принимает объект с параметром query (строка поиска, опционально)
// export const fetchPopularMovies = async({query}: {query: string}) => {
//     // Если query есть, используем эндпоинт поиска фильмов с параметром query
//     // Если query нет, запрашиваем список популярных фильмов, сортированных по популярности
//  const endpoint = query
//  ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
 
//  : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

// // Выполняем HTTP-запрос с методом GET к сформированному эндпоинту
// // Передаем заголовки из TMDB_CONFIG для авторизации и формата ответа
//  const response = await fetch(endpoint, {
//     method: 'GET',
//     headers: TMDB_CONFIG.headers,
//  });

// // ошибка с текстом статуса, если проблема
// // @ts-ignore отключает проверку TypeScript на типизацию
// if(!response.ok){
//     //@ts-ignore
//     throw new Error('Failed to fetch movies!!', response.statusText );
//  }

//  // Парсим ответ сервера в формате JSON
//  const data = await response.json();

// // TMDB API возвращает объект с полем results
// // Возвращаем массив фильмов из свойства results
//  return data.results;

// }