
# Streampel

[Live Demo](https://streampel.vercel.app)

Hinweis: Die Navigation der horizontalen Karussellleiste oben auf der Seite erfolgt über die Pfeiltasten (rechts und links) der Tastatur.

Die mit Expo, TypeScript und Tailwind CSS erstellte mobile App ruft Filme ab und erstellt mit Appwrite einen Popularitätsalgorithmus.
Sie bewertet Filme anhand verschiedener Engagement-Kennzahlen.

In der Live-Demo-Version ist aufgrund der Einschränkungen der kostenlosen Version von BaaS Appwrite nur der Modus für nicht authentifizierte Benutzer verfügbar.


Im vorhandenen Project ist jedoch auch die Möglichkeit zur Registrierung und Authentifizierung von Benutzern sowie die Funktion für registrierte Benutzer implementiert, Filme auf der Seite „Saved“ in Lesezeichen zu speichern. Dieser Funktionalität kann im untenstehenden Demo-Video angesehen werden.

Demo Registrierung und Authentifizierung 

![Demo Registrierung und Authentifizierung ](https://github.com/LindtAna/streampel/blob/main/demo%20auth.gif)


Demo Filme speichern

![Demo Filme speichern](https://github.com/LindtAna/streampel/blob/main/demo%20save%20movie.gif)

---

## Design

Die Benutzeroberfläche ist **responsiv** und **modular** aufgebaut.

### Design in Figma

Das UI-Design basiert auf dem folgenden Figma-Template:  
[STREAMPEL](https://www.figma.com/design/c6NHYQem8G59odVSijIjl2/Movie-App-w--React-Native?node-id=108001-11&t=HFwNNqPSze4JROQ6-0)

Der UI-Design wurde im Verlauf der Entwicklung von mir angepasst und weiterentwickelt, um eine bessere visuelle Darstellung zu erzielen.
---

## Funktionalität
- Echtzeitdaten: Abrufen und Anzeigen von Filmdaten in Echtzeit
- Startseite: Empfohlene Filme und Filme entdecken
- Suchseite: Suchen Sie nach Ihren Lieblingsfilmen
- Popularitätsalgorithmus: Verfolgen Sie Nutzersuchen, um die beliebtesten Filme anzuzeigen
- Es wurde die Möglichkeit zur Registrierung und Authentifizierung von Benutzern implementiert. Die Daten werden in einer Appwrite-Datenbank gespeichert
- Registrierte Benutzer können Filme speichern. Diese Daten werden in einer separaten Appwrite-Datenbank gespeichert. Die gespeicherten Filme der Benutzer werden auf einer eigenen Registerkarte der Anwendung angezeigt. Es besteht außerdem die Möglichkeit, einen Film aus den gespeicherten Inhalten zu entfernen

---

## Projektstruktur
```text
streampel/
├─ app/
│  ├─ _layout.tsx
│  ├─ globals.css
│  ├─ auth/
│  │  ├─ _layout.tsx
│  │  ├─ sign-in.tsx
│  │  └─ sign-up.tsx
│  ├─ (tabs)/
│  │  ├─ _layout.tsx
│  │  ├─ index.tsx
│  │  ├─ profile.tsx
│  │  ├─ saved.tsx
│  │  └─ search.tsx
│  └─ movies/
│     ├─ _layout.tsx
│     └─ [id].tsx
├─ assets/
│  ├─ fonts/
│  ├─ icons/
│  └─ images/
├─ components/
│  ├─ CustomButton.tsx
│  ├─ CustomInput.tsx
│  ├─ MovieCard.tsx
│  ├─ SearchBar.tsx
│  └─ TrendingCard.tsx
├─ constants/
│  ├─ icons.ts
│  └─ images.ts
├─ interfaces/
│  └─ interfaces.d.ts
├─ services/
│  ├─ api.ts
│  ├─ appwrite.ts
│  └─ useFetch.ts
├─ store/
│  └─ auth.store.ts
├─ types/
│  └─ images.d.ts
├─ .gitignore
├─ README.md
├─ app.json
├─ babel.config.json
├─ eslint.config.js
├─ metro.config.js
├─ nativewind-env.d.ts
├─ package-lock.json
├─ package.json
├─ tailwind.config.js
└─ tsconfig.json

```

## Technologie-Stack

| Technologie   | Beschreibung                                                                                                                                                                   |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Expo          | Open-Source-Plattform zum Erstellen universeller nativer Apps (Android, iOS, Web) mit JavaScript/TypeScript und React Native.        |
| React Native       | Ein Framework zum Erstellen mobiler Benutzeroberflächen mit React. Es ermöglicht komponentenbasierte, plattformübergreifende Entwicklung mit deklarativer Benutzeroberfläche, umfassender nativer API-Unterstützung und ist eng mit Expo für Navigation und native Funktionen integriert.     |
| Tailwind CSS | Utility-First-CSS-Framework, das Low-Level-Klassen direkt im HTML erlaubt und den Designprozess beschleunigt                                                                          |
| Appwrite         | Open-Source-Backend-as-a-Service-Plattform, die sichere Authentifizierung (E-Mail/Passwort, OAuth, SMS, Magic Links), Datenbanken und Dateispeicher mit Komprimierung/Verschlüsselung bietet. Die Verwaltung erfolgt über eine einheitliche Konsole und eine Microservices-Architektur.                                                   |



## Dokumentation der verwendeten Frameworks und Bibliotheken

- **[React Native](https://reactnative.dev/docs/environment-setup)**: Ein Framework zur Entwicklung nativer mobiler Anwendungen mit JavaScript und React.
- **[Expo](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical)**: Eine Plattform zur Vereinfachung der Entwicklung, Bereitstellung und Verwaltung von React Native Apps.
- **[NativeWind](https://www.nativewind.dev/docs/getting-started/installation)**: Eine Bibliothek zur Nutzung von Tailwind CSS in React Native Projekten.
- **[Appwrite](https://cloud.appwrite.io/console/project-fra-68d2d4aa00337e093de3/get-started)**: Eine Open-Source Backend-as-a-Service Plattform für sichere und skalierbare Anwendungen.
- **[The Movie Database (TMDB) API](https://developer.themoviedb.org/reference/intro/getting-started)**: Eine API zur Abfrage von Film- und Seriendaten.
- **[React Native Safe Area Context](https://github.com/AppAndFlow/react-native-safe-area-context)**: Eine flexible Lösung zur Handhabung von Safe Area Insets in JavaScript für React Native.
