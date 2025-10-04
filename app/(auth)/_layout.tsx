import { Slot } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  // const {isAuthenticated} = useAuthStore();

  // if(isAuthenticated) return <Redirect href="/" />
  return (
    <SafeAreaView className="bg-primary flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Slot />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}