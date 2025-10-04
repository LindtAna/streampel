import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { signIn } from "@/services/appwrite";
import useAuthStore from "@/store/auth.store"; // Добавили импорт хранилища
import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, View } from "react-native";

// Anmeldung eines bestehenden Benutzers
const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Zustand zur Verfolgung des Formularübermittlungsprozesses (true — wird gesendet, false — nicht)
  const [form, setForm] = useState({ email: '', password: '' }); // Zustand, um die Formulardaten zu speichern (E-Mail, Passwort)

  // Funktion zur Verarbeitung der Formularübermittlung
  // Überprüfung, ob alle Formularfelder ausgefüllt sind
  const submit = async () => {
    if (!form.email || !form.password) return Alert.alert('Error', 'Please Enter valid email address and password');

    // Setze isSubmitting auf true, um den Ladeindikator anzuzeigen
    setIsSubmitting(true);

    // Aufruf der Anmeldefunktion von Appwrite (Backend-Service)
    // Aktualisierung des Zustands des Zustand-Speichers (useAuthStore)
    // Weiterleitung zur Profilseite (replace verhindert das Zurückkehren)
    // In jedem Fall (Erfolg oder Fehler) wird der Ladeindikator entfernt 
    try {
      await signIn({ email: form.email, password: form.password });
      await useAuthStore.getState().fetchAuthenticatedUser(); 
      router.replace('/(tabs)/profile'); 
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hauptcontainer mit Hintergrundstil und Abständen
  return (
    <View className="bg-primary gap-24">
      <Image source={images.bg} className="absolute w-full z-0" />

      <View className="flex-row justify-center mt-20 items-center">
        <Image source={icons.logo} className="w-37 h-15" />
      </View>

{/* Anmeldenform container */}
      <View className="gap-7 bg-dark-200/60 rounded-lg px-7 py-5 m-5">
        <CustomInput
          placeholder="E-Mail eingeben"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          label="Email"
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="Passwort eingeben"
          value={form.password}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          label="Password"
          secureTextEntry={true}
        />

        <CustomButton
          title="Einloggen"
          isLoading={isSubmitting}
          onPress={submit}
        />

        <View className="flex justify-center items-center flex-col gap-1">
          <Text className="text-light-200 text-lg font-bold">
            Hast du noch kein Konto?
          </Text>
          <Link href="/sign-up" className="text-lg font-bold color-yellow-500">Registrier dich!</Link>
        </View>
      </View>
    </View>
  );
};

export default SignIn;