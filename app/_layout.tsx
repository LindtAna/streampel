import useAuthStore from "@/store/auth.store";
import * as Sentry from '@sentry/react-native';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import './globals.css';

Sentry.init({
  dsn: 'https://4a235e9f4bb9e9d329e80a40a85d5210@o4510126895333376.ingest.de.sentry.io/4510126986100816',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

});

export default Sentry.wrap(function RootLayout() {

const { isLoading, fetchAuthenticatedUser } = useAuthStore();

useEffect(() => {
    fetchAuthenticatedUser()
  }, []);

  if(isLoading) return null;

  return (
  <>

  <StatusBar hidden={true} />
  <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        
      </Stack>

      
  </>
  );
});