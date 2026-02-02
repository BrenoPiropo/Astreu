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
import { Constellation } from "../services/astronomy";

const { width } = Dimensions.get("window");

interface Props {
  constellation: Constellation;
  onBack: () => void;
}

export const ConstellationDetail: React.FC<Props> = ({
  constellation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.mainContainer}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header de Imagem */}
        <View style={styles.imageContainer}>
          <Image
            source={constellation.imageUrl}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Botão Voltar com UX Melhorada */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={onBack}
          >
            <View style={styles.backButtonInner}>
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>Voltar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Área de Conteúdo */}
        <View style={styles.content}>
          <View style={styles.indicator} />

          <Text style={styles.mainTitle}>{constellation.name}</Text>
          <Text style={styles.description}>{constellation.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>⭐ Estrelas Principais</Text>
          <View style={styles.starList}>
            {constellation.stars.map((star, index) => (
              <View key={index} style={styles.starBadge}>
                <Text style={styles.starText}>{star}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionHeader}>📜 A Jornada Histórica</Text>
          <Text style={styles.historyText}>{constellation.history}</Text>

          {/* Espaço de segurança para a Tab Bar */}
          <View style={{ height: insets.bottom + 60 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  imageContainer: {
    width: width,
    height: 380,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(11, 13, 23, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(76, 201, 240, 0.4)",
    // Sombra suave para o botão se destacar da imagem
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backIcon: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 6,
  },
  backText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  content: {
    padding: 25,
    backgroundColor: "#05070A",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: "#1A1E2E",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  mainTitle: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  description: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 5,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#1A1E2E",
    marginVertical: 15,
  },
  sectionHeader: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },
  starList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  starBadge: {
    backgroundColor: "rgba(76, 201, 240, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(76, 201, 240, 0.2)",
  },
  starText: {
    color: "#4CC9F0",
    fontSize: 13,
    fontWeight: "bold",
  },
  historyText: {
    color: "#BBB",
    fontSize: 16,
    lineHeight: 28,
    textAlign: "justify",
  },
});
