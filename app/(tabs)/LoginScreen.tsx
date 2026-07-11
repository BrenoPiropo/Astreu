import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Validação de campos vazios
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos para decolar! 🚀");
      return;
    }

    setLoading(true);

    try {
      // 10.0.2.2 é o alias para o localhost do seu PC no emulador Android
      const response = await axios.post("http://10.0.2.2:3000/users/login", {
        email: email,
        senha: senha,
      });

      if (response.data) {
        console.log("Login bem-sucedido:", response.data.nome);
        await AsyncStorage.setItem('@astreuhub_user', JSON.stringify(response.data));
        // Redireciona para a tela principal (index) e limpa o histórico de navegação
        router.replace("/community");
      }
    } catch (error: any) {
      console.error("Erro no login:", error.message);

      const msgErro =
        error.response?.status === 401
          ? "Email ou senha incorretos."
          : "Não foi possível conectar à central de comando (Backend).";

      Alert.alert("Falha na Missão", msgErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1464802686167-b939a67e06a1",
      }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* LOGO DO ASTREU */}
        <Image
          source={require("../../assets/images/Astreu.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>ASTREU</Text>
        <Text style={styles.subtitle}>Sua jornada astronômica começa aqui</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Seu email estelar"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Sua senha secreta"
            placeholderTextColor="#888"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#05070A" />
            ) : (
              <Text style={styles.buttonText}>DECOLAR 🚀</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 7, 10, 0.8)",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 8,
  },
  subtitle: {
    color: "#4CC9F0",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.9,
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 18,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(76, 201, 240, 0.3)",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CC9F0",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 5, // Sombra no Android
  },
  buttonText: {
    color: "#05070A",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
