import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
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
import { getStarNeighbors, StarNeighbor } from "../../services/api";

export default function SkyScreen() {
  const [stars, setStars] = useState<StarNeighbor[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoVisible, setInfoVisible] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadStars();
  }, []);

  async function loadStars() {
    const data = await getStarNeighbors();
    setStars(data);
    setLoading(false);
  }

  // Abre o Aladin Lite com as coordenadas da estrela
  const openStellarMap = (ra: number, dec: number) => {
    const url = `https://aladin.u-strasbg.fr/AladinLite/?target=${ra}%20${dec}&fov=0.2&survey=P%2FDSS2%2Fcolor`;
    Linking.openURL(url);
  };

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>VIZINHANÇA SOLAR</Text>
          <Text style={styles.headerTitle}>Estrelas</Text>
        </View>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setInfoVisible(true)}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={26}
            color="#4CC9F0"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={stars}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.starIconContainer}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={Math.max(12, 28 - item.magnitude / 2)}
                color="#FFD60A"
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.starName}>{item.name}</Text>

              <View style={styles.constellationBadge}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={12}
                  color="#4CC9F0"
                />
                <Text style={styles.constellationText}>
                  {item.constellation}
                </Text>
              </View>

              <Text style={styles.starDetails}>
                Brilho: {item.magnitude} mag
              </Text>

              {/* BOTÃO PARA FOTO REAL (SIMBAD/ALADIN) */}
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => openStellarMap(item.ra, item.dec)}
              >
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={14}
                  color="#FFD60A"
                />
                <Text style={styles.photoButtonText}>FOTO REAL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.distContainer}>
              <Text style={styles.distValue}>{item.dist_ly}</Text>
              <Text style={styles.distLabel}>ANOS-LUZ</Text>
            </View>
          </View>
        )}
      />

      {/* MODAL DE INFORMAÇÃO */}
      <Modal animationType="fade" transparent={true} visible={infoVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons
                name="telescope"
                size={32}
                color="#4CC9F0"
              />
              <Text style={styles.modalTitle}>Exploração Profunda</Text>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                O botão <Text style={styles.highlight}>FOTO REAL</Text> conecta
                você ao serviço
                <Text style={styles.highlight}> Aladin Lite</Text> do
                Observatório de Estrasburgo.
              </Text>
              <Text style={styles.sectionTitle}>O que você verá?</Text>
              <Text style={styles.modalText}>
                Imagens reais capturadas por telescópios terrestres integradas
                ao banco de dados SIMBAD. Isso permite ver a estrela exata no
                campo estelar onde ela reside.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.closeButtonText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070A" },
  header: {
    paddingHorizontal: 25,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerSubtitle: {
    color: "#4CC9F0",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  infoButton: {
    backgroundColor: "rgba(76, 201, 240, 0.1)",
    padding: 8,
    borderRadius: 12,
  },
  card: {
    backgroundColor: "#11141D",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  starIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 214, 10, 0.05)",
    borderRadius: 25,
  },
  infoContainer: { flex: 1, marginLeft: 15 },
  starName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  constellationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
    marginBottom: 4,
  },
  constellationText: {
    color: "#4CC9F0",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  starDetails: { color: "#555", fontSize: 11 },

  // Estilo do novo botão de Foto
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 214, 10, 0.08)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 214, 10, 0.2)",
  },
  photoButtonText: {
    color: "#FFD60A",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  distContainer: { alignItems: "flex-end" },
  distValue: { color: "#4CC9F0", fontSize: 20, fontWeight: "bold" },
  distLabel: {
    color: "#4CC9F0",
    fontSize: 8,
    fontWeight: "bold",
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#11141D",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  modalTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  modalBody: { marginBottom: 20 },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  modalText: { color: "#BBB", fontSize: 15, lineHeight: 22 },
  highlight: { color: "#FFF", fontWeight: "bold" },
  closeButton: {
    backgroundColor: "#4CC9F0",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  closeButtonText: { color: "#000", fontWeight: "bold" },
});
