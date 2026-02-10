import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PostDetailScreen() {
  const { title, author, content, image, pdfName, pdfUri } =
    useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleOpenPDF = async () => {
    if (pdfUri) {
      // Abre o menu de compartilhamento/visualização nativo do celular
      await Sharing.shareAsync(pdfUri as string);
    } else {
      alert("Arquivo PDF não encontrado ou corrompido.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Header Imagem */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image as string }} style={styles.mainImage} />
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

        {/* Conteúdo */}
        <View style={styles.contentWrapper}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{String(author)[0]}</Text>
            </View>
            <View>
              <Text style={styles.authorName}>{author}</Text>
              <Text style={styles.dateText}>
                Publicado recentemente • Estudo
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>

          {/* Seção de PDF */}
          {pdfName ? (
            <TouchableOpacity style={styles.pdfCard} onPress={handleOpenPDF}>
              <View style={styles.pdfIconCircle}>
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={32}
                  color="#FF4D4D"
                />
              </View>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfTitle}>{pdfName}</Text>
                <Text style={styles.pdfAction}>
                  Clique para abrir o documento
                </Text>
              </View>
              <MaterialCommunityIcons
                name="download"
                size={24}
                color="#4CC9F0"
              />
            </TouchableOpacity>
          ) : null}

          <Text style={styles.description}>{content}</Text>

          {/* Divider para Comentários */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Discussão da Comunidade</Text>

          <View style={styles.emptyComments}>
            <MaterialCommunityIcons
              name="message-outline"
              size={40}
              color="#333"
            />
            <Text style={styles.emptyText}>
              Seja o primeiro a comentar este estudo espacial.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Input de comentário fixo (Simulação) */}
      <View
        style={[styles.commentInputArea, { paddingBottom: insets.bottom + 10 }]}
      >
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputText}>Escreva seu ponto de vista...</Text>
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
  imageContainer: { width: "100%", height: 300 },
  mainImage: { width: "100%", height: "100%" },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },

  contentWrapper: { padding: 20 },
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
    borderColor: "#333",
    marginBottom: 20,
  },
  pdfIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF4D4D15",
    justifyContent: "center",
    alignItems: "center",
  },
  pdfInfo: { flex: 1, marginLeft: 15 },
  pdfTitle: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  pdfAction: { color: "#4CC9F0", fontSize: 12, marginTop: 2 },

  description: { color: "#BBB", fontSize: 16, lineHeight: 26 },

  divider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 30 },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
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
  },
  inputText: { color: "#444" },
  sendBtn: { marginLeft: 15 },
});
