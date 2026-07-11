import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// 10.0.2.2 é o IP para o Android Studio acessar o localhost do seu PC
const BASE_URL = "http://10.0.2.2:3000";

export default function PostDetailScreen() {
  const params = useLocalSearchParams();
  const { title, author, content, image, pdfUri, pdfName } = params;

  const insets = useSafeAreaInsets();
  const router = useRouter();

  // DEBUG LOG: Verifique o que aparece no seu terminal do VS Code/Expo
  useEffect(() => {
    console.log("=== DEBUG POST DETAIL ===");
    console.log("pdfUri recebido:", pdfUri);
    console.log("pdfName recebido:", pdfName);
    console.log("URL que será gerada:", `${BASE_URL}/uploads/${pdfUri}`);
  }, [pdfUri]);

  const handleOpenPDF = async () => {
    if (!pdfUri) return;

    // Se já tiver http, usa direto. Se não tiver, monta.
    const fileUrl = pdfUri.toString().startsWith("http")
      ? pdfUri.toString()
      : `${BASE_URL}/uploads/${pdfUri}`;

    console.log("URL Final Corrigida:", fileUrl);
    await WebBrowser.openBrowserAsync(fileUrl);
  };1
  const fullImageUrl = image?.toString().startsWith("http")
    ? image.toString()
    : `${BASE_URL}/uploads/${image}`;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: fullImageUrl }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {String(author || "A")[0].toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{author || "Astrônomo"}</Text>
              <Text style={styles.dateText}>Hub de Transmissão Astreu</Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>

          {/* Card do PDF Dinâmico */}
          {pdfUri && pdfUri !== "null" && pdfUri !== "" && (
            <TouchableOpacity
              style={styles.pdfCard}
              onPress={handleOpenPDF}
              activeOpacity={0.7}
            >
              <View style={styles.pdfIconCircle}>
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={32}
                  color="#FF4D4D"
                />
              </View>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfTitle} numberOfLines={1}>
                  {/* Exibe o nome real do arquivo ou o nome amigável */}
                  {pdfName || pdfUri}
                </Text>
                <Text style={styles.pdfAction}>
                  Toque para abrir relatório original
                </Text>
              </View>
              <MaterialCommunityIcons
                name="open-in-new"
                size={22}
                color="#4CC9F0"
              />
            </TouchableOpacity>
          )}

          <Text style={styles.description}>{content}</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Comentários</Text>
          <View style={styles.emptyComments}>
            <MaterialCommunityIcons
              name="message-outline"
              size={36}
              color="#1A1E2E"
            />
            <Text style={styles.emptyText}>
              Sem comentários nesta frequência.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.commentInputArea, { paddingBottom: insets.bottom + 10 }]}
      >
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputText}>Escreva sua análise...</Text>
        </View>
        <TouchableOpacity style={styles.sendBtn}>
          <MaterialCommunityIcons name="send" size={24} color="#4CC9F0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070A" },
  imageContainer: { width: "100%", height: 350 },
  mainImage: { width: "100%", height: "100%" },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    padding: 20,
    marginTop: -30,
    backgroundColor: "#05070A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  authorRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CC9F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontWeight: "bold", color: "#000" },
  authorName: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  dateText: { color: "#666", fontSize: 12 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  pdfCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#11141D",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1A1E2E",
    marginBottom: 25,
  },
  pdfIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  pdfInfo: { flex: 1, marginLeft: 15 },
  pdfTitle: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  pdfAction: { color: "#4CC9F0", fontSize: 12, marginTop: 2 },
  description: {
    color: "#BBB",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "justify",
  },
  divider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 30 },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  emptyComments: { alignItems: "center", marginTop: 20 },
  emptyText: {
    color: "#444",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  commentInputArea: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#11141D",
    borderTopWidth: 1,
    borderColor: "#1A1E2E",
    alignItems: "center",
  },
  inputPlaceholder: {
    flex: 1,
    backgroundColor: "#05070A",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  inputText: { color: "#555" },
  sendBtn: { marginLeft: 15 },
});
