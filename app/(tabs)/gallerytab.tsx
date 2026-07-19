import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 15;

interface GalleryTabProps {
  posts: any[];
  uploadsUrl: string;
  onOpenDetail: (item: any) => void;
}

export default function GalleryTab({
  posts,
  uploadsUrl,
  onOpenDetail,
}: GalleryTabProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedFav, setSelectedFav] = useState<any | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favsJson = await AsyncStorage.getItem("@astreuhub_favorites");
    if (favsJson) {
      const favUrls = JSON.parse(favsJson);
      const formattedFavs = favUrls.map((url: string, index: number) => ({
        id: `fav-${index}`,
        url_midia: url,
        isDataset: true,
        usuario: { nome: "Arquivo Astreu" },
      }));
      setFavorites(formattedFavs);
    }
  };

  const removeFavorite = async (urlToRemove: string) => {
    Alert.alert(
      "Remover Favorito",
      "Deseja retirar esta imagem da sua galeria?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const favsJson = await AsyncStorage.getItem("@astreuhub_favorites");
            if (favsJson) {
              const currentFavs = JSON.parse(favsJson);
              const updatedFavs = currentFavs.filter(
                (url: string) => url !== urlToRemove,
              );
              await AsyncStorage.setItem(
                "@astreuhub_favorites",
                JSON.stringify(updatedFavs),
              );
              setFavorites(
                favorites.filter((f) => f.url_midia !== urlToRemove),
              );
              setSelectedFav(null); // Fecha o modal se estiver aberto
            }
          },
        },
      ],
    );
  };

  const handlePressItem = (item: any) => {
    if (item.isDataset) {
      setSelectedFav(item); // Abre o modal de expansão próprio do componente
    } else {
      onOpenDetail(item); // Chama a navegação para posts normais da comunidade
    }
  };

  const allGalleryData = [
    ...posts.filter((p) => p.tipo === "photo"),
    ...favorites,
  ];

  const renderItem = ({ item }: { item: any }) => {
    const imageUri = item.isDataset
      ? item.url_midia
      : `${uploadsUrl}/${item.url_midia}`;

    return (
      <View style={styles.galleryCard}>
        <TouchableOpacity
          onPress={() => handlePressItem(item)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: imageUri.replace("localhost", "10.0.2.2") }}
            style={styles.galleryImage}
          />
        </TouchableOpacity>
        <View style={styles.overlay}>
          <Text style={styles.overlayText} numberOfLines={1}>
            {item.isDataset
              ? "⭐ FAVORITO"
              : `@${item.usuario?.nome?.toLowerCase().replace(/\s/g, "")}`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={allGalleryData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sua galeria está vazia.</Text>
        }
      />

      {/* MODAL DE EXPANSÃO PARA FAVORITOS */}
      <Modal visible={!!selectedFav} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedFav(null)}
          >
            <MaterialCommunityIcons name="close" size={30} color="#FFF" />
          </TouchableOpacity>

          {selectedFav && (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Image
                source={{
                  uri: selectedFav.url_midia.replace("localhost", "10.0.2.2"),
                }}
                style={styles.fullImage}
                resizeMode="contain"
              />

              <View style={styles.modalInfo}>
                <Text style={styles.modalTitle}>Imagem do Dataset</Text>
                <Text style={styles.modalSubtitle}>
                  Sincronizado via Arquivo Astreu
                </Text>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFavorite(selectedFav.url_midia)}
                >
                  <MaterialCommunityIcons
                    name="heart-remove"
                    size={24}
                    color="#FFF"
                  />
                  <Text style={styles.removeBtnText}>REMOVER DA GALERIA</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 5, paddingBottom: 40 },
  galleryCard: {
    width: COLUMN_WIDTH,
    height: 200,
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#11141D",
  },
  galleryImage: { width: "100%", height: "100%", resizeMode: "cover" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
  },
  overlayText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  emptyText: { color: "#444", textAlign: "center", marginTop: 50 },

  // Estilos do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 5,
  },
  fullImage: { width: width, height: height * 0.6 },
  modalInfo: { padding: 30, alignItems: "center" },
  modalTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  modalSubtitle: {
    color: "#4CC9F0",
    fontSize: 12,
    marginBottom: 30,
    letterSpacing: 1,
  },
  removeBtn: {
    flexDirection: "row",
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    gap: 10,
  },
  removeBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
});
