import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importado para o ícone
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { Constellation, getConstellationsData } from "../../services/astronomy";

export default function SkyScreen() {
  const constellations = getConstellationsData();
  const [selectedConst, setSelectedConst] = useState<Constellation | null>(
    null,
  );
  const [infoVisible, setInfoVisible] = useState(false); // Estado para o modal de info
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSeeMore = () => {
    if (selectedConst) {
      const id = selectedConst.id;
      setSelectedConst(null);
      router.push({
        pathname: "/constellation/[id]",
        params: { id },
      });
    }
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.container}>
        {/* HEADER COM BOTÃO DE INFO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>SKY</Text>
            <Text style={styles.subtitle}>
              Explore as constelações visíveis hoje
            </Text>
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
          data={constellations}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedConst(item)}
            >
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>✨ {item.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <Text style={styles.arrow}>〉</Text>
            </TouchableOpacity>
          )}
        />

        {/* Modal de Info da Tela (O que a tela faz) */}
        <Modal visible={infoVisible} transparent animationType="fade">
          <View style={styles.infoModalOverlay}>
            <View style={styles.infoModalContent}>
              <View style={styles.infoModalHeader}>
                <MaterialCommunityIcons
                  name="star-shooting"
                  size={30}
                  color="#4CC9F0"
                />
                <Text style={styles.infoModalTitle}>Exploração Estelar</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.infoModalText}>
                  Esta tela é o seu guia para o céu noturno. Aqui você encontra
                  um catálogo das
                  <Text style={styles.highlight}> Constelações</Text> mais
                  famosas e visíveis.
                </Text>

                <Text style={styles.sectionTitle}>Como usar</Text>
                <Text style={styles.infoModalText}>
                  • Toque em uma constelação para abrir um{" "}
                  <Text style={styles.highlight}>resumo rápido</Text> e ver sua
                  representação visual.{"\n"}• Dentro do resumo, clique em "Ver
                  História Completa" para mergulhar na{" "}
                  <Text style={styles.highlight}>
                    mitologia e dados astronômicos
                  </Text>{" "}
                  detalhados de cada conjunto de estrelas.
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

        {/* Modal de Detalhes Rápidos (Existente) */}
        <Modal
          visible={!!selectedConst}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={selectedConst?.imageUrl}
                style={styles.modalImage}
              />
              <View style={styles.modalPadding}>
                <Text style={styles.modalTitle}>{selectedConst?.name}</Text>
                <Text style={styles.modalSub}>
                  {selectedConst?.description}
                </Text>
                <View style={styles.divider} />
                <Text style={styles.summaryLabel}>RESUMO HISTÓRICO</Text>
                <Text style={styles.summaryText} numberOfLines={3}>
                  {selectedConst?.history}
                </Text>
                <TouchableOpacity
                  style={styles.btnAction}
                  onPress={handleSeeMore}
                >
                  <Text style={styles.btnActionText}>
                    VER HISTÓRIA COMPLETA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnClose}
                  onPress={() => setSelectedConst(null)}
                >
                  <Text style={styles.btnCloseText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#05070A" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  subtitle: { color: "#4CC9F0", fontSize: 16, marginBottom: 20 },
  infoButton: {
    padding: 8,
    backgroundColor: "rgba(76, 201, 240, 0.1)",
    borderRadius: 12,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#11141D",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  cardInfo: { flex: 1 },
  cardName: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  cardDesc: { color: "#888", fontSize: 14, marginTop: 4 },
  arrow: { color: "#4CC9F0", fontSize: 18 },

  // Estilos do Modal de Detalhes Rápidos
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#0B0D17",
    width: "85%",
    borderRadius: 25,
    overflow: "hidden",
  },
  modalImage: { width: "100%", height: 200 },
  modalPadding: { padding: 20 },
  modalTitle: { color: "#FFF", fontSize: 26, fontWeight: "bold" },
  modalSub: { color: "#4CC9F0", fontSize: 14, marginTop: 5 },
  divider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 15 },
  summaryLabel: {
    color: "#555",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryText: {
    color: "#BBB",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  btnAction: {
    backgroundColor: "#4CC9F0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnActionText: { color: "#000", fontWeight: "bold" },
  btnClose: { marginTop: 15, alignItems: "center" },
  btnCloseText: { color: "#666" },

  // Estilos do Novo Modal de Info (Botão I)
  infoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 25,
  },
  infoModalContent: {
    backgroundColor: "#0B0D17",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "#4CC9F0",
  },
  infoModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  infoModalTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  infoModalText: {
    color: "#BBB",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  highlight: { color: "#FFF", fontWeight: "bold" },
  infoCloseButton: {
    backgroundColor: "#4CC9F0",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  infoCloseButtonText: { color: "#000", fontWeight: "bold" },
});
