import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getConstellationsData } from "../../services/astronomy";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const item = getConstellationsData().find((c) => c.id === id);

  if (!item) return null;

  return (
    <View style={styles.mainContainer}>
      {/* 1. Remove o título 'constellation/[id]' da barra nativa */}
      <Stack.Screen options={{ headerShown: false }} />

      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* 2. Header de Imagem imersivo */}
        <View style={styles.imageWrapper}>
          <Image
            source={item.imageUrl}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* 3. Botão Voltar com UX de cápsula (Blur manual) */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + 10 }]}
            activeOpacity={0.8}
          >
            <View style={styles.backBtnInner}>
              <Text style={styles.backBtnText}>VOLTAR</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Área de Conteúdo */}
        <View style={styles.container}>
          <View style={styles.dragIndicator} />

          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.description}</Text>

          <View style={styles.tagRow}>
            {item.stars.map((s) => (
              <View key={s} style={styles.tag}>
                <Text style={styles.tagText}>⭐ {s}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>A Ciência e a História</Text>
          <Text style={styles.historyText}>{item.history}</Text>

          {/* Garante que o conteúdo não fique sob a Tab Bar ou notch inferior */}
          <View style={{ height: insets.bottom + 50 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#05070A" },
  imageWrapper: { width: "100%", height: 380, position: "relative" },
  heroImage: { width: "100%", height: "100%" },

  // Design de botão "Cápsula" para melhor UX
  backBtn: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  backBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(11, 13, 23, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(76, 201, 240, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  backIcon: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  backBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1,
  },

  container: {
    padding: 25,
    backgroundColor: "#05070A",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#1A1E2E",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  desc: {
    color: "#4CC9F0",
    fontSize: 17,
    marginTop: 5,
    fontStyle: "italic",
    fontWeight: "500",
  },

  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 20 },
  tag: {
    backgroundColor: "rgba(76, 201, 240, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(76, 201, 240, 0.15)",
  },
  tagText: { color: "#4CC9F0", fontSize: 13, fontWeight: "600" },

  divider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 25 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  historyText: {
    color: "#CCC",
    fontSize: 16,
    lineHeight: 28,
    textAlign: "justify",
  },
  footer: { marginTop: 40, alignItems: "center" },
  footerNote: {
    color: "#444",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
