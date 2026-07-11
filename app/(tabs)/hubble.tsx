import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const BASE_URL = "http://10.0.2.2:3000";

interface CategoryDetails {
  title: string;
  description: string;
  details: string;
}

const categories = [
  { id: "planets", label: "Planetas" },
  { id: "cosmos space", label: "Espaço" },
  { id: "galaxies", label: "Galáxias" },
  { id: "nebula", label: "Nebulosas" },
  { id: "stars", label: "Estrelas" },
  { id: "constellation", label: "Constelações" },
];

const categoryInfo: Record<string, CategoryDetails> = {
  planets: {
    title: "Exploração Planetária",
    description: "Corpos celestes que orbitam uma estrela.",
    details: "Dataset inclui imagens de sondas rochosas e gasosas.",
  },
  "cosmos space": {
    title: "Vastidão do Cosmos",
    description: "O espaço sideral e sua densidade de partículas.",
    details: "Visões de campo profundo do universo.",
  },
  galaxies: {
    title: "Ilhas de Estrelas",
    description: "Sistemas massivos unidos pela gravidade.",
    details: "Galáxias espirais, elípticas e irregulares.",
  },
  nebula: {
    title: "Berçários Estelares",
    description: "Nuvens gigantescas de poeira e gás.",
    details: "Regiões de formação de novas estrelas.",
  },
  stars: {
    title: "Fornos Nucleares",
    description: "Esferas de plasma gerando luz e calor.",
    details: "Ciclo de vida estelar completo.",
  },
  constellation: {
    title: "Mapas Estelares",
    description: "Padrões imaginários no céu noturno.",
    details: "As 88 constelações reconhecidas oficialmente.",
  },
};

interface SpaceImage {
  name: string;
  url: string;
}

export default function HubbleScreen() {
  const [selectedCategory, setSelectedCategory] = useState("planets");
  const [images, setImages] = useState<SpaceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<SpaceImage | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadDatasetImages();
    loadFavorites();
  }, [selectedCategory]);

  const loadFavorites = async () => {
    const saved = await AsyncStorage.getItem("@astreuhub_favorites");
    if (saved) setFavorites(JSON.parse(saved));
  };

  const toggleFavorite = async (url: string) => {
    let newFavs = [...favorites];
    if (newFavs.includes(url)) {
      newFavs = newFavs.filter((item) => item !== url);
    } else {
      newFavs.push(url);
    }
    setFavorites(newFavs);
    await AsyncStorage.setItem("@astreuhub_favorites", JSON.stringify(newFavs));
  };

  async function loadDatasetImages() {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/gallery/${encodeURIComponent(selectedCategory)}`,
      );
      setImages(response.data);
    } catch (error) {
      console.error("Erro dataset:", error);
    } finally {
      setLoading(false);
    }
  }

  const getCleanUrl = (url: string) => url.replace("localhost", "10.0.2.2");
  const currentInfo = categoryInfo[selectedCategory] || categoryInfo.planets;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>DATASET CIENTÍFICO</Text>
          <Text style={styles.headerTitle}>Arquivo</Text>
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

      <View style={{ height: 50 }}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                selectedCategory === item.id && styles.categoryBtnActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  selectedCategory === item.id && styles.categoryBtnTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CC9F0" />
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setSelectedImage(item)}
              >
                <Image
                  source={{ uri: getCleanUrl(item.url) }}
                  style={styles.image}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.9)"]}
                  style={styles.overlay}
                >
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.favBadge}
                onPress={() => toggleFavorite(item.url)}
              >
                <MaterialCommunityIcons
                  name={
                    favorites.includes(item.url) ? "heart" : "heart-outline"
                  }
                  size={20}
                  color={favorites.includes(item.url) ? "#FF4D4D" : "#FFF"}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* MODAL DE INFORMAÇÃO */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>{currentInfo.title}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.infoModalText}>
                {currentInfo.description}
              </Text>
              <Text style={styles.sectionTitle}>Detalhes Técnicos</Text>
              <Text style={styles.infoModalText}>{currentInfo.details}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.infoCloseButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.infoCloseButtonText}>FECHAR</Text>
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
    padding: 25,
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
  listContent: { paddingHorizontal: 5, paddingBottom: 100 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flex: 0.5,
    height: 200,
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#11141D",
  },
  image: { width: "100%", height: "100%" },
  favBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    height: 60,
    justifyContent: "flex-end",
  },
  cardTitle: { color: "#FFF", fontSize: 10, fontWeight: "600" },
  categoryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#11141D",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  categoryBtnActive: { backgroundColor: "#4CC9F0", borderColor: "#4CC9F0" },
  categoryBtnText: { color: "#4CC9F0", fontWeight: "bold", fontSize: 12 },
  categoryBtnTextActive: { color: "#000" },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 25,
  },
  infoModalContent: {
    backgroundColor: "#0A0C12",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#4CC9F0",
  },
  infoModalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoModalText: {
    color: "#BBB",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  sectionTitle: { color: "#4CC9F0", fontWeight: "bold", marginTop: 10 },
  infoCloseButton: {
    backgroundColor: "#4CC9F0",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  infoCloseButtonText: { fontWeight: "bold" },
});
