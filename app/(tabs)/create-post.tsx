import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles/CreateStyles";

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [tipo, setTipo] = useState<"article" | "photo">("article");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const userJson = await AsyncStorage.getItem("@astreuhub_user");
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  const resetForm = () => {
    setTitulo("");
    setConteudo("");
    setImageUri(null);
    setPdfUri(null);
    setPdfName(null);
    setTipo("article");
    setUploadProgress(0);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.1,
        aspect: [4, 3],
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.log("Erro na galeria:", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permissão necessária",
          "Você precisa permitir o acesso à câmera para tirar uma foto.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.1,
        aspect: [4, 3],
      });

      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.log("Erro na câmera:", error);
      Alert.alert(
        "Erro na Câmera",
        "Não foi possível abrir a câmera. Teste em um dispositivo físico.",
      );
    }
  };

  const handleImageSelection = () => {
    Alert.alert(
      "Selecionar Imagem",
      "Escolha de onde deseja adicionar a imagem:",
      [
        { text: "Tirar Foto", onPress: takePhoto },
        { text: "Escolher da Galeria", onPress: pickImage },
        { text: "Cancelar", style: "cancel" },
      ],
    );
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setPdfName(result.assets[0].name);
      setPdfUri(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!userId) return Alert.alert("Erro", "Sessão expirada");
    if (!titulo || !conteudo || !imageUri)
      return Alert.alert("Erro", "Preencha os campos obrigatórios");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("conteudo", conteudo);
    formData.append("tipo", tipo);
    formData.append("usuarioId", userId.toString());

    formData.append("midia", {
      uri: imageUri,
      name: "imagem.jpg",
      type: "image/jpeg",
    } as any);

    if (pdfUri && tipo === "article") {
      formData.append("pdf", {
        uri: pdfUri,
        name: pdfName || "estudo.pdf",
        type: "application/pdf",
      } as any);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://10.0.2.2:3000/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 90000,
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total;
            if (total) {
              const currentProgress = Math.round(
                (progressEvent.loaded * 100) / total,
              );
              setUploadProgress(currentProgress > 98 ? 98 : currentProgress);
            }
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        setUploadProgress(100);
        Alert.alert("Sucesso", "Missão enviada ao Hub!", [
          { text: "OK", onPress: () => router.replace("/(tabs)/community") },
        ]);
        resetForm();
      }
    } catch (e: any) {
      console.log("Erro Upload:", e.message);
      Alert.alert(
        "Erro",
        "Falha na transmissão. Verifique o tamanho do arquivo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#05070A" }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>NOVA TRANSMISSÃO</Text>
          {loading && (
            <Text style={{ color: "#4CC9F0", fontSize: 10 }}>
              {uploadProgress}% enviado
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handlePublish} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#4CC9F0" />
          ) : (
            <Text style={styles.publishText}>PUBLICAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>TIPO DE POST</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeBtn, tipo === "article" && styles.typeBtnActive]}
            onPress={() => setTipo("article")}
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={20}
              color={tipo === "article" ? "#000" : "#4CC9F0"}
            />
            <Text
              style={[
                styles.typeBtnText,
                tipo === "article" && styles.typeBtnTextActive,
              ]}
            >
              ESTUDO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, tipo === "photo" && styles.typeBtnActive]}
            onPress={() => {
              setTipo("photo");
              // Limpa o PDF caso o usuário mude para "FOTO"
              setPdfUri(null);
              setPdfName(null);
            }}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={20}
              color={tipo === "photo" ? "#000" : "#4CC9F0"}
            />
            <Text
              style={[
                styles.typeBtnText,
                tipo === "photo" && styles.typeBtnTextActive,
              ]}
            >
              FOTO
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título da descoberta"
          placeholderTextColor="#444"
        />

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleImageSelection}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="image-plus"
                size={32}
                color="#4CC9F0"
              />
              <Text style={styles.uploadText}>Selecionar ou Tirar Foto</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Renderização Condicional: Só aparece se tipo for "article" */}
        {tipo === "article" && (
          <TouchableOpacity style={styles.pdfPicker} onPress={pickDocument}>
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={24}
              color={pdfName ? "#FF4D4D" : "#4CC9F0"}
            />
            <Text
              style={[styles.pdfPickerText, pdfName && { color: "#FFF" }]}
              numberOfLines={1}
            >
              {pdfName || "Anexar PDF (Opcional)"}
            </Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição..."
          placeholderTextColor="#444"
          multiline
          value={conteudo}
          onChangeText={setConteudo}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
