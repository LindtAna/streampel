import { getCurrentUser } from '@/services/appwrite';
import { create } from 'zustand';

// Beschreibung der Struktur des Benutzerobjekts
// interface User {
//     accountId?: string;
//     name: string;
//     email: string;
//     avatar?: string;
// }

interface User {
    $id: string;  // User ID из Auth
    name: string;
    email: string;
    registration: string;  // (Joined)
    status: string;  // Status ( Unverified)
    avatar?: string;  // avatar
}

// Beschreibung des Authentifizierungsstatus im Zustand-Speicher
type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;

}

// Erstellung des Zustand-Speichers zur Verwaltung des Authentifizierungsstatus
// Initialer Zustand
// Funktion zum Ändern des Authentifizierungsstatus
// Funktion zum Setzen der Benutzerdaten
// Funktion zum Ändern des Ladezustandsи
const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),

    setUser: (user) => set({ user }),

    setLoading: (value) => set({ isLoading: value }),


// Abrufen der Daten des aktuellen Benutzers über getCurrentUser von Appwrite
// !!user konvertiert user in einen Boolean: true, wenn user nicht null ist, false wenn null
// // Im Fehlerfall werden der Authentifizierungsstatus und die Benutzerdaten zurückgesetzt
    fetchAuthenticatedUser: async () => {
        set({ isLoading: true });

        try {
            const user = await getCurrentUser();

            set({ isAuthenticated: !!user, user: user as unknown as User });
      
        } catch (err) {
            console.log('fetchAuthenticatedUser: No session or error:', err);
            set({ isAuthenticated: false, user: null })
        } finally {
            set({ isLoading: false });
        }
    }

}))

export default useAuthStore;