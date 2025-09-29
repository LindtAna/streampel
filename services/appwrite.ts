import { Client, Databases, ID, Query } from 'react-native-appwrite';

// Verfolgt die vom Benutzer durchgeführten Suchen
// IDs für Datenbank und Table
// Werte werden aus .env-Datei für sichere Konfiguration entnommen
// ID Database & ID Table in Appwrite
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Erstellung einer neuen Instanz des Appwrite-Clients
// Festlegen der Server-URL von Appwrite (Cloud-Version)
// Festlegen der Projekt-ID von Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

// Initialisierung eines Objekts für die Arbeit mit der Appwrite-Datenbank
// Übergabe des Clients zur Authentifizierung von Anfragen
const database = new Databases(client);


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


// if a document is found increment the searchCound field
// if no document is found -> create a new document in Appwrite database -> 1