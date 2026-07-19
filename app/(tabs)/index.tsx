import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loading } from "../../components/Loading";
import { ApodResponse, getApod } from "../../services/api";

const SPACE_FACTS = [
  "O pôr do sol em Marte é azul devido à poeira fina em sua atmosfera.",
  "Existe uma nuvem de álcool no espaço que é 463 bilhões de quilômetros de largura.",
  "Um dia em Vênus é mais longo do que um ano inteiro na Terra.",
  "O silêncio no espaço é absoluto, pois não há ar para transportar ondas sonoras.",
  "A pegada dos astronautas na Lua pode durar milhões de anos, pois não há vento.",
  "Existem mais estrelas no universo do que grãos de areia em todas as praias da Terra.",
];

export default function ApodScreen() {
  const [data, setData] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dailyFact, setDailyFact] = useState("");

  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    loadData();
    const day = new Date().getDate();
    setDailyFact(SPACE_FACTS[day % SPACE_FACTS.length]);
  }, []);

  async function loadData() {
    try {
      const result = await getApod();
      setData(result);
    } catch (error) {
      console.error("Erro ao carregar APOD:", error);
    } finally {
      setLoading(false);
    }
  }

  const navigateTo = (path: string) => {
    setMenuVisible(false);
    setTimeout(() => {
      router.push(path as any);
    }, 100);
  };

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D17" />

      {/* HEADER: HAMBURGUER NA ESQUERDA */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>EXPLORAÇÃO ESPACIAL</Text>
          <Text style={styles.headerTitle}>Foto do Dia</Text>
        </View>

        {/* Espaçador para manter o título centralizado ou equilibrado */}
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: data?.url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.dateOverlay}>
            <Text style={styles.dateText}>{data?.date}</Text>
          </View>
        </View>

        <View style={styles.factCard}>
          <View style={styles.factHeader}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={18}
              color="#4CC9F0"
            />
            <Text style={styles.factLabel}>VOCÊ SABIA?</Text>
          </View>
          <Text style={styles.factText}>{dailyFact}</Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.mainTitle}>{data?.title}</Text>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#000"
            />
            <Text style={styles.detailButtonText}>VER DETALHES</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE DETALHES */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.dragIndicator} />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#4CC9F0"
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{data?.title}</Text>
              <Text style={styles.description}>{data?.explanation}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0D17" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: { alignItems: "center", flex: 1 },
  headerSubtitle: {
    color: "#4CC9F0",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  menuButton: { padding: 5 },

  // --- DRAWER ESQUERDO ---
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "row",
  },
  drawerCloseArea: { flex: 1 },
  drawerContent: {
    width: 280,
    backgroundColor: "#0B0D17",
    height: "100%",
    padding: 25,
    borderRightWidth: 1,
    borderRightColor: "#1A1E2E",
  },
  profileSection: { alignItems: "center", marginBottom: 10 },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#4CC9F0",
    padding: 3,
    marginBottom: 10,
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 40 },
  welcomeText: { color: "#666", fontSize: 13 },
  userNameText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  userButtonMenu: {
    backgroundColor: "#4CC9F0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  userButtonText: { color: "#000", fontSize: 11, fontWeight: "bold" },

  drawerDivider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 25 },
  drawerSectionLabel: {
    color: "#444",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
  },
  drawerItemText: { color: "#DDD", fontSize: 16, fontWeight: "500" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: "auto",
    marginBottom: 20,
  },
  logoutText: { color: "#FF4D4D", fontSize: 15, fontWeight: "bold" },

  // --- RESTO DO LAYOUT ---
  scrollView: { flex: 1 },
  imageWrapper: { width: "100%", height: 400 },
  image: { width: "100%", height: "100%" },
  dateOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    borderRadius: 10,
  },
  dateText: { color: "#FFF", fontSize: 12 },
  factCard: {
    margin: 20,
    padding: 15,
    backgroundColor: "#0F111A",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  factHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  factLabel: { color: "#4CC9F0", fontSize: 11, fontWeight: "bold" },
  factText: {
    color: "#BBB",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
  actionCard: { padding: 20, alignItems: "center" },
  mainTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  detailButton: {
    flexDirection: "row",
    backgroundColor: "#4CC9F0",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    gap: 10,
  },
  detailButtonText: { fontWeight: "bold", letterSpacing: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0B0D17",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: "85%",
  },
  modalHeader: { alignItems: "center", marginBottom: 20 },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  closeButton: { position: "absolute", right: 0 },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  description: { color: "#BBB", fontSize: 16, lineHeight: 24 },
});
