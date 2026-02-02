import { MaterialCommunityIcons } from "@expo/vector-icons";
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

// Lista de curiosidades para rotacionar
const SPACE_FACTS = [
  "O pôr do sol em Marte é azul devido à poeira fina em sua atmosfera.",
  "Existe uma nuvem de álcool no espaço que é 463 bilhões de quilômetros de largura.",
  "Um dia em Vênus é mais longo do que um ano inteiro na Terra.",
  "Se você pudesse colocar Saturno em uma banheira gigante, ele flutuaria na água.",
  "O silêncio no espaço é absoluto, pois não há ar para transportar ondas sonoras.",
  "A pegada dos astronautas na Lua pode durar milhões de anos, pois não há vento.",
  "Existem mais estrelas no universo do que grãos de areia em todas as praias da Terra.",
];

export default function ApodScreen() {
  const [data, setData] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyFact, setDailyFact] = useState("");

  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
    // Seleciona uma curiosidade baseada no dia do mês
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

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D17" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>EXPLORAÇÃO ESPACIAL</Text>
        <Text style={styles.headerTitle}>Foto do Dia</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* CONTAINER DA IMAGEM PRINCIPAL */}
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

        {/* CARD DE CURIOSIDADE DINÂMICA */}
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

        {/* TÍTULO E BOTÃO DE DETALHES */}
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

      {/* MODAL DE DESCRIÇÃO (NASA) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  Astronomy Picture of the Day
                </Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>EXPLICAÇÃO CIENTÍFICA</Text>
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
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerSubtitle: {
    color: "#4CC9F0",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  scrollView: { flex: 1 },
  imageWrapper: { width: "100%", height: 400, position: "relative" },
  image: { width: "100%", height: "100%", backgroundColor: "#1A1E2E" },
  dateOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

  // Novo Estilo do Card de Curiosidade
  factCard: {
    margin: 20,
    padding: 15,
    backgroundColor: "rgba(76, 201, 240, 0.05)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(76, 201, 240, 0.2)",
  },
  factHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  factLabel: {
    color: "#4CC9F0",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  factText: {
    color: "#DDD",
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },

  actionCard: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    alignItems: "center",
  },
  mainTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  detailButton: {
    flexDirection: "row",
    backgroundColor: "#4CC9F0",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    gap: 10,
    elevation: 5,
  },
  detailButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0B0D17",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
  },
  closeButton: { position: "absolute", right: 0 },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoBadge: {
    backgroundColor: "rgba(76, 201, 240, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 15,
  },
  infoBadgeText: { color: "#4CC9F0", fontSize: 10, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#1A1E2E", marginBottom: 20 },
  sectionLabel: {
    color: "#555",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  description: {
    color: "#BBB",
    lineHeight: 24,
    fontSize: 16,
    textAlign: "justify",
  },
});
