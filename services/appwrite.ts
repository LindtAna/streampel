import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

// Konstanten für die Identifikatoren der Datenbank und Sammlungen, die aus .env bezogen werden
// ID der Datenbank zur Speicherung von Suchanfragen
// ID der Tabelle für Suchanfragen
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
// ID der Datenbank für Benutzer
// ID der Tabelle für Benutzerdaten
const DATABASE_USERS_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_USER_ID!;
const COLLECTION_USERS_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_USER_ID!;

// ID der Tabelle für Filme, die von registrierten Benutzern in saved gespeichert wurden
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

// Erstellung einer Instanz des Appwrite-Clients zur Interaktion mit dem Server
// Festlegen der URL des Appwrite-Servers
// Festlegen der Projekt-ID aus .env
// Festlegen der Plattform der App
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform('streampel.vercel.app')

// Initialisierung von Objekten für die Arbeit mit Konten, Datenbank und Avataren
export const account = new Account(client)
const database = new Databases(client);
const avatars = new Avatars(client)


//////// SPEICHERN DER SUCHANFRAGEN DES BENUTZERS IN EINER DATENBANK /////////

// Suche nach Dokumenten in der Sammlung, die der übergebenen Suchanfrage entsprechen
// Überprüfung, ob bereits ein Eintrag für die gegebene Suchanfrage existiert
// Aktualisierung des bestehenden Dokuments, Erhöhung des Suchzählers um 1
// Falls kein Eintrag gefunden wurde, Erstellung eines neuen Dokuments in der Sammlung mit einer eindeutigen ID
export const updateSearchCount = async (query: string, movie: Movie) => {
    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
            )
        }
        else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }

    } catch (error) {
        console.log(error);
        throw error;
    }

}


/////// ABRUFEN DER SIEBEN MEISTGESUCHTEN FILME AUS DER APPWRITE-DATENBANK///////

// Begrenzt auf 7 Dokumente, sortiert nach absteigendem count-Wert
// Rückgabe der Liste von Dokumenten als Array von TrendingMovie-Objekten
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(7),
            Query.orderDesc('count'),
        ])

        return result.documents as unknown as TrendingMovie[];

    } catch (error) {
        console.log(error);
        return undefined;
    }
}


///////// AUTHENTICATION & ANMELDUNG /////////
interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}

interface SignInParams {
    email: string;
    password: string;
}

interface User {
    accountId?: string;
    name: string;
    email: string;
    avatar?: string;
}

// Erstellung eines neuen Kontos in Appwrite mit einer eindeutigen ID, E-Mail, Passwort und Namen
// Durchführung der Anmeldung mit den soeben erstellten Zugangsdaten
export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if (!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await database.createDocument(
            DATABASE_USERS_ID,
            COLLECTION_USERS_ID,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                name,
                password, // später entfernen!!!
                avatar: avatarUrl
            });


    } catch (er) {
        throw new Error(er as string);
    }
}

// Anmeldung eines bestehenden Benutzers im System
export const signIn = async ({ email, password }: SignInParams) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
    } catch (er) {
        throw new Error(er as string);
    }
}

// Abrufen von Informationen über den aktuellen Benutzer
// Abrufen der Daten des aktuellen Kontos, Suche nach dem Benutzereintrag in der Datenbank anhand der Konto-ID
export const getCurrentUser = async () => {
try {
    // checken, ob es eine aktive Sitzung gibt
    try {
      await account.getSession('current');
    } catch (e) {
      //// Wenn keine Sitzung -> null (Gast)
      return null;
    }

// try{
    const currentAccount = await account.get()
    if (!currentAccount) return null;
    // if(!currentAccount) throw Error;
    const currentUser = await database.listDocuments(
        DATABASE_USERS_ID,
        COLLECTION_USERS_ID,
        [Query.equal("accountId", currentAccount.$id)]
    )
    if (!currentUser.documents.length) return null;
    // if(!currentUser) throw Error;
    return currentUser.documents[0];    
    } catch (err: any) {
    console.log('getCurrentUser: No session or error:', err.message);
    return null; 
    }
};
// }catch (er) throw new Error(er as string;}



// Abmeldung eines bestehenden Benutzers
export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (er) {
    console.error('Logout failed:', er);
    throw new Error(er as string);
  }
};


/// SPEICHERN VON MOVIES FÜR USER/////

// Die Funktion saveMovie speichert einen Film in der Datenbanktabelle für einen bestimmten Benutzer
// Nimmt userAccountId (ID des Benutzerkontos) und das movie-Objekt (Filmdaten aus der TMDB API) entgegen
export const saveMovie = async (userAccountId: string, movie: Movie | MovieDetails) => {
  try {
   // Objekt mit den Daten, die in der Datenbank gespeichert werden sollen:
    // userId — ID des Benutzers, der den Film speichert
    // movieId — ID des Films aus der TMDB API
    // title, posterPath -> weitere Details in MovieCard.tsx
    const payload = {
      userId: userAccountId, 
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path ?? "",
      vote_average: Number(movie.vote_average ?? 0),
      release_date: movie.release_date ?? "",
    };

    
    console.log("createDocument payload:", payload);

    // Erstellung eines neuen Dokuments in der Tabelle SAVED_COLLECTION_ID
    // ID.unique() generiert eine eindeutige ID für das Dokument
    // payload enthält die Daten, die als neues Dokument gespeichert werden
    return await database.createDocument(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      ID.unique(),
      payload
    );
  } catch (error) {
    console.error("Error saving movie:", error);

    throw error;
  }
};


// Entfernt einen Film aus der Liste der gespeicherten Filme eines bestimmten Benutzers
// Nimmt userAccountId (ID des Benutzerkontos) und movieId (ID des Films aus der TMDB API) entgegen
export const removeMovie = async (userAccountId: string, movieId: number) => {
  try {
   // Suche nach einem Dokument in der Sammlung SAVED_COLLECTION_ID, das den angegebenen userId und movieId entspricht
    // Query.equal für die Filterung nach diesen beiden Feldern
    const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("userId", userAccountId),
      Query.equal("movieId", movieId),
    ]);

    // Prüfung, ob mindestens ein Dokument gefunden wurde (res.total > 0)
    // Löschung des gefundenen Dokuments aus der Sammlung anhand seiner eindeutigen ID ($id)
    if (res.total > 0) {
      await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, res.documents[0].$id);
    }
  } catch (error) {
    console.error("Error removing movie:", error);
    throw error;
  }
};


// Überprüft, ob ein Film für einen bestimmten Benutzer gespeichert ist
export const isMovieSaved = async (userAccountId: string, movieId: number) => {
  try {
    // Suche nach Dokumenten in der Sammlung SAVED_COLLECTION_ID, die den angegebenen userId und movieId entsprechen
    const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("userId", userAccountId),
      Query.equal("movieId", movieId),
    ]);

   // Gibt true zurück, wenn mindestens ein Dokument gefunden wurde (res.total > 0), sonst false
    return res.total > 0;
  } catch (error) {
    
    console.error("Error checking saved movie:", error);
    // Im Fehlerfall wird false zurückgegeben, um die Ausführung der Anwendung nicht zu unterbrechen
    return false;
  }
};



// Ruft die Liste aller gespeicherten Filme für einen bestimmten Benutzer ab
// Nimmt userAccountId (ID des Benutzerkontos) entgegen
export const listSavedMovies = async (userAccountId: string) => {
  try {
    // Suche nach allen Dokumenten in der Sammlung SAVED_COLLECTION_ID, bei denen userId mit dem übergebenen userAccountId übereinstimmt
    // Query.equal wird für die Filterung nach userId verwendet
    const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("userId", userAccountId),
    ]);

    /// Gibt ein Array von Dokumenten zurück (Liste der gespeicherten Filme)
    return res.documents;
  } catch (error) {
    
    console.error("Error listing saved movies:", error);
    // Im Fehlerfall wird ein leeres Array zurückgegeben, um die Ausführung der Anwendung nicht zu unterbrechen
    return [];
  }
};



// Appwrite - Open-Source-Plattform BaaS
// https://cloud.appwrite.io/console/project-fra-68d2d4aa00337e093de3/get-started