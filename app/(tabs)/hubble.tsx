import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
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
import { Loading } from "../../components/Loading";
import { getHubbleGallery, HubbleImage } from "../../services/hubble";

const { width } = Dimensions.get("window");

export default function HubbleScreen() {
  const [images, setImages] = useState<HubbleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<HubbleImage | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadUniversePhotos();
  }, []);

  async function loadUniversePhotos() {
    setLoading(true);
    const data = await getHubbleGallery();
    setImages(data);
    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>IMAGENS DO UNIVERSO</Text>
          <Text style={styles.headerTitle}>Hubble</Text>
        </View>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setInfoVisible(true)}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={26}
            color="#FFD60A"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedImage(item)}
          >
            <Image source={{ uri: item.url }} style={styles.image} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={styles.overlay}
            >
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />

      {/* Modal de Detalhes da Foto */}
      <Modal visible={!!selectedImage} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeModal}
            onPress={() => setSelectedImage(null)}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={35}
              color="#FFF"
            />
          </TouchableOpacity>
          {selectedImage && (
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage.url }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <View style={styles.detailsContainer}>
                <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                <Text style={styles.modalDate}>
                  Capturado em: {selectedImage.date}
                </Text>
                <ScrollView
                  style={{ maxHeight: 250 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.modalDesc}>
                    {selectedImage.description}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Modal de Informação (O BOTÃO "I") */}
      <Modal visible={infoVisible} transparent={true} animationType="fade">
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <MaterialCommunityIcons
                name="telescope"
                size={32}
                color="#FFD60A"
              />
              <Text style={styles.infoModalTitle}>Legado Hubble</Text>
            </View>

            <ScrollView style={styles.infoModalBody}>
              <Text style={styles.infoModalText}>
                Esta galeria reúne as mais impressionantes fotografias
                capturadas pelo{" "}
                <Text style={styles.highlight}>
                  Telescópio Espacial Hubble (HST)
                </Text>
                .
              </Text>

              <Text style={styles.sectionTitle}>Exploração Espacial</Text>
              <Text style={styles.infoModalText}>
                Desde 1990, o Hubble orbita a Terra acima da atmosfera, o que
                permite captar imagens com uma clareza inigualável. Ele foi
                fundamental para determinar a idade do universo e a existência
                de energia escura.
              </Text>

              <Text style={styles.sectionTitle}>O que você está vendo?</Text>
              <Text style={styles.infoModalText}>
                Aqui você encontrará{" "}
                <Text style={styles.highlight}>Nebulosas vibrantes</Text>,
                galáxias em colisão e berçários estelares, utilizando luz
                visível e ultravioleta para revelar os segredos do cosmos.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.infoCloseButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.infoCloseButtonText}>ENTENDI</Text>
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
    color: "#FFD60A",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  infoButton: {
    backgroundColor: "rgba(255, 214, 10, 0.1)",
    padding: 8,
    borderRadius: 12,
  },
  listContent: { paddingHorizontal: 5, paddingBottom: 100 },
  card: {
    flex: 0.5,
    height: 250,
    margin: 5,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#11141D",
  },
  image: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    height: 80,
    justifyContent: "flex-end",
  },
  cardTitle: { color: "#FFF", fontSize: 11, fontWeight: "600" },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  closeModal: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    zIndex: 10,
  },
  modalContent: { alignItems: "center", width: "100%" },
  fullImage: { width: width, height: width },
  detailsContainer: {
    padding: 30,
    backgroundColor: "#05070A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    width: "100%",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalDate: { color: "#FFD60A", fontSize: 11, marginBottom: 15 },
  modalDesc: { color: "#AAA", fontSize: 14, lineHeight: 22 },

  // Info Modal Estilizado
  infoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    padding: 25,
  },
  infoModalContent: {
    backgroundColor: "#0A0C12",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "#FFD60A",
  },
  infoModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoModalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoModalBody: {
    maxHeight: 350,
    marginBottom: 20,
  },
  infoModalText: {
    color: "#BBB",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#FFD60A",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  highlight: { color: "#FFF", fontWeight: "bold" },
  infoCloseButton: {
    backgroundColor: "#FFD60A",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  infoCloseButtonText: { color: "#000", fontWeight: "bold" },
});
