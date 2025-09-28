// Custom Hook für die Ausführung asynchroner Anfragen und die Verwaltung ihres Zustands
// Wird verwendet, um die Arbeit mit der API zu vereinfachen
// fetch Movies
// fetch MovieDetails
// useFetch(fetchMovies)

import { useEffect, useState } from "react";

// Definieren den  Hook useFetch, der zwei Parameter akzeptiert:
// - fetchFunction: Funktion, die ein Promise mit Daten vom Typ T zurückgibt (z.B. Liste von Filmen)
// - autoFetch: Boolescher Flag, der angibt, ob die Anfrage beim Mounten der Komponente automatisch ausgeführt werden soll
// Generics (T) machen den Hook universell für verschiedene Datentypen, und autoFetch bietet Flexibilität bei der Verwaltung von Anfragenconst

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    // Zustand zum Speichern der empfangenen Daten (null, wenn keine Daten vorhanden sind)
    const [data, setData] = useState<T | null>(null);
    // Zustand zum Verfolgen des Ladevorgangs
    // Ermöglicht die Anzeige eines Ladeindikators (z.B. Spinner) in der UI
    const [loading, setLoading] = useState(false);
    // Zustand zum Speichern von Fehlern
    const [error, setError] = useState<Error | null>(null);

    // Funktion zur Ausführung der asynchronen Anfrage
    // Kapselt die Logik der Anfrage, sodass sie sowohl automatisch als auch manuell aufgerufen werden kann
    const fetchData = async () => {
        try {
           // Signalisiert der UI, dass die Anfrage begonnen hat. Setzt vorherigen Fehler zurück
            setLoading(true);
            setError(null);

            // fetchFunction enthält die Logik der API-Anfrage, die Daten zurückgibt
            const result = await fetchFunction();
            // setData(Array.isArray(result) ? result : []);
            // Speichert die empfangenen Daten im Zustand
            setData(result);

        } 
        // Behandelt Fehler, die bei der Anfrage auftreten
        catch (err) {
            //@ts-ignore
            setError(err instanceof Error ? err : new Error('An error occurred!'));
        } finally {
            setLoading(false);
        }
    }

    // Funktion zum Zurücksetzen des Zustands des Hooks
    // Löscht Daten, Fehler und Ladezustand
    // reset storniert keine laufenden Anfragen — wenn fetchData läuft, können Zustände nach reset geändert werden
     const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

   // useEffect für die automatische Ausführung der Anfrage beim Mounten der Komponente
    // Wenn autoFetch=true, wird die Anfrage sofort nach dem Rendern der Komponente ausgeführt
      useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, []);

   // Gibt ein Objekt mit Daten, Ladezustand, Fehler und Verwaltungsfunktionen zurück
    // Komponenten erhalten Zugriff auf den Zustand und können refetch für erneute Anfragen oder reset zum Zurücksetzen aufrufen
     return { data, loading, error, refetch: fetchData, reset };
}


export default useFetch






// // Кастомный хук для выполнения асинхронных запросов и управления их состоянием
// // Используется для упрощения работы с API
// //fetch Movies
// //fetch MovieDetails
// //useFetch(fetchMovies)

// import { useEffect, useState } from "react";

// // Определяем кастомный хук useFetch, который принимает два параметра:
// // - fetchFunction: функция, возвращающая Promise с данными типа T (например, список фильмов)
// // - autoFetch: булевый флаг, указывающий, нужно ли автоматически выполнять запрос при монтировании компонента
// // Generics (T) делают хук универсальным для работы с разными типами данных, а autoFetch даёт гибкость в управлении запросами
// const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
//     // Состояние для хранения полученных данных (null, если данных нет)
//     const [data, setData] = useState<T | null>(null);
//     // Состояние для отслеживания процесса загрузки
//     // позволяет показывать индикатор загрузки (например, спиннер) в UI
//     const [loading, setLoading] = useState(false);
//     // Состояние для хранения ошибок
//     const [error, setError] = useState<Error | null>(null);

//     // Функция для выполнения асинхронного запроса
//     // Инкапсулирует логику запроса, чтобы её можно было вызывать как автоматически, так и вручную
//     const fetchData = async () => {
//         try {
//             // Сигнализируем UI, что запрос начался. Сбрасываем предыдущую ошибку
//             setLoading(true);
//             setError(null);

//             // fetchFunction содержит логику API-запроса, возвращающего данные
//             const result = await fetchFunction();
//             // Сохраняем полученные данные в состояние
//             setData(result);

//         } 
//         // Обрабатываем ошибки, возникающие при запросе
//         catch (err) {
//             //@ts-ignore
//             setError(err instanceof Error ? err : new Error('An error occurred!'));
//         } finally {
//             setLoading(false);
//         }
//     }

//     // Функция для сброса состояния хука
//     // очистка данных, ошибок и состояния загрузки
//     //reset не отменяет ongoing запросы — если fetchData в процессе, states могут измениться после reset
//     const reset = () => {
//         setData(null);
//         setLoading(false);
//         setError(null);
//     }

//     // useEffect для автоматического выполнения запроса при монтировании компонента
//     // если autoFetch=true, запрос выполняется сразу после рендера компонента
//     useEffect(() => {
//         if (autoFetch) {
//             fetchData();
//         }
//     }, []);

//     // Возвращаем объект с данными, состоянием загрузки, ошибкой и функциями управления
//     // Компоненты получают доступ к состоянию и могут вызывать refetch для повторного запроса или reset для сброса
//     return { data, loading, error, refetch: fetchData, reset };
// }
// export default useFetch