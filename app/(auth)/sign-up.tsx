
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { createUser } from "@/services/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, View } from "react-native";


// Registrierung eines neuen Benutzers
// Zustand zur Verfolgung des Formularversandprozesses (true - wird gesendet, false - wird nicht gesendet)
// Zustand zur Speicherung der Formulardaten (Name, E-Mail, Passwort)
const SignUp = () => {
  const[isSubmitting, setIsSubmitting] = useState(false);
  const[form, setForm] = useState({name: '', email:'', password:''});
  
// Asynchrone Funktion zur Verarbeitung des Formularversands
// Überprüfung, ob alle Formularfelder ausgefüllt sind
  const submit = async () => {

    if(!form.name || !form.email || !form.password)return Alert.alert('Error', 'Please Enter valid email address and password');

// Setzen von isSubmitting auf true, um Ladeindikator anzuzeigen
    setIsSubmitting(true) 


//Aufruf der Registrierungsfunktion von Appwrite (Backend-Service)
// Senden der Daten an den Server
// Wenn die Registrierung erfolgreich ist, leiten zur Profilseite weiter
// In jedem Fall (Erfolg oder Fehler) wird der Ladeindikator entfernt
    try{

      await createUser({
        email:form.email,
        password: form.password,
        name: form.name
      })
      router.replace('/profile');
    } catch(error: any){
      Alert.alert('Error', error.message);
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    <View className="bg-primary gap-24">

      <Image source={images.bg} className="absolute w-full z-0" />

      <View className="flex-row justify-center mt-20 items-center">
        <Image source={icons.logo} className="w-37 h-15" />
      </View>

        <View className="gap-7 bg-dark-200/60 rounded-lg px-7 py-5 m-5">
        <View className="flex justify-center items-center flex-col gap-1">
  <Text className=" color-yellow-500 text-lg font-bold">
   Willkommen!
  </Text>
</View>
        <CustomInput
            placeholder="Benutzername eingeben"
            value={form.name}
            onChangeText={(text) => setForm((prev) => ({...prev, name: text}))}
            label="Benutzername"
          /> 
          <CustomInput
            placeholder="Email eingeben"
            value={form.email}
            onChangeText={(text) => setForm((prev) => ({...prev, email: text}))}
            label="Email"
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Passwort eingeben"
            value={form.password}
            onChangeText={(text) => setForm((prev) => ({...prev, password: text}))}
            label="Password"
            secureTextEntry={true}
          />

          <CustomButton
            title="Konto erstellen"
            isLoading={isSubmitting}
            onPress={submit}
          />
        </View>
      </View>

  );
};

export default SignUp;

//Залогиниться