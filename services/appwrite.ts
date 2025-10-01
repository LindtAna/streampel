import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

// Verfolgt die vom Benutzer durchgeführten Suchen
// IDs für Datenbank und Table
// Werte werden aus .env-Datei für sichere Konfiguration entnommen
// ID Database & ID Table in Appwrite
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const DATABASE_USERS_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_USER_ID!;
const COLLECTION_USERS_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_USER_ID!;

// Erstellung einer neuen Instanz des Appwrite-Clients
// Festlegen der Server-URL von Appwrite (Cloud-Version)
// Festlegen der Projekt-ID von Appwrite
// Initialisierung eines Objekts für die Arbeit mit der Appwrite-Datenbank
// Übergabe des Clients zur Authentifizierung von Anfragen
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform('com.lindtana.streampel')

export const account = new Account(client)
const database = new Databases(client);
const avatars = new Avatars(client)

//SAVING USER SEARCH QUESTIONS IN A DATABANK
// Initialisierung eines Objekts für die Arbeit mit der Appwrite-Datenbank
// Abfrage von Dokumenten in der Sammlung
// Filter: Suche nach Dokumenten, bei denen searchTerm mit der Anfrage übereinstimmt
export const updateSearchCount = async (query: string, movie: Movie) => {
    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        // Überprüfen, ob bereits ein Eintrag für die Suchanfrage existiert
        // Wenn ein Eintrag gefunden wurde, nehmen wir das erste Dokument
        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            // Aktualisieren des bestehenden Eintrags in der Tabelle, Erhöhung des Zählers (count) um 1
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
            // Wenn kein Eintrag gefunden wurde, erstellen wir ein neues Dokument in der Sammlung
            // Generieren einer eindeutigen ID für den neuen Eintrag in der Tabelle
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


// Abrufen der sieben meistgesuchten Filme aus der Appwrite-Datenbank
// Begrenzt auf 7 Dokumente, sortiert nach nach absteigendem count-Wert
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


//AUTHENTICATION
interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}

interface SignInParams {
    email: string;
    password: string;
}

interface GetMenuParams {
    category: string;
    query: string;
}


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
                avatar: avatarUrl
            });


    } catch (er) {
        throw new Error(er as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // Forcefully terminate the current session (for testing)
        await account.deleteSession('current');
        console.log('The current session has ended.');
    } catch (error: any) {
        if (error.code !== 404) {  
            console.error('Session termination error:', error);
        }
    }
    
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (er) {
        throw new Error(er as string);
    }
}




// if a document is found increment the searchCound field
// if no document is found -> create a new document in Appwrite database -> 1


// Appwrite - Open-Source-Plattform BaaS
// https://cloud.appwrite.io/console/project-fra-68d2d4aa00337e093de3/get-started