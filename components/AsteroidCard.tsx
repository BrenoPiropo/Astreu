import React, { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Tipagem baseada nos dados reais da NASA NeoWs
interface AsteroidCardProps {
  name: string;
  estimatedDiameter: string; // Em Km ou Metros
  isPotentiallyHazardous: boolean;
  velocity: string; // Km/h
  missDistance: string; // Distância que passará da Terra
  approachDate: string;
}

const AsteroidCard: React.FC<AsteroidCardProps> = ({
  name,
  estimatedDiameter,
  isPotentiallyHazardous,
  velocity,
  missDistance,
  approachDate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnimation, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const rotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Girar 180 graus
  });

  // O conteúdo de trás precisa ser invertido para não aparecer espelhado
  const backRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <TouchableOpacity
      onPress={flipCard}
      activeOpacity={0.9}
      style={styles.container}
    >
      {/* LADO FRONTAL: Identificação e Alerta */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ rotateY }] },
          isFlipped && { opacity: 0 }, // Esconde a frente quando vira
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.dateText}>{approachDate}</Text>
          {isPotentiallyHazardous && (
            <View style={styles.dangerBadge}>
              <Text style={styles.dangerText}>⚠️ RISCO REAL</Text>
            </View>
          )}
        </View>

        <View style={styles.wordSection}>
          <Text style={styles.asteroidName}>
            {name.replace("(", "").replace(")", "")}
          </Text>
          <Text style={styles.label}>Diâmetro Estimado</Text>
          <Text style={styles.diameterValue}>{estimatedDiameter} m</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerHint}>Toque para análise de dados ➔</Text>
        </View>
      </Animated.View>

      {/* LADO TRASEIRO: Ciência de Dados e Insights */}
      <Animated.View
        style={[
          styles.card,
          styles.backCard,
          { transform: [{ rotateY: backRotateY }] },
          !isFlipped && { opacity: 0 },
        ]}
      >
        <Text style={styles.backTitle}>Análise de Trajetória</Text>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Velocidade Relativa:</Text>
          <Text style={styles.dataValue}>{velocity} km/h</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Distância da Terra:</Text>
          <Text style={styles.dataValue}>{missDistance} km</Text>
        </View>

        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>Insight Científico</Text>
          <Text style={styles.insightText}>
            Este objeto viaja a uma velocidade equivalente a{" "}
            {(Number(velocity) / 1234).toFixed(1)}x a velocidade do som.
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10, width: "100%" },
  card: {
    backgroundColor: "#1A1A2E",
    padding: 25,
    borderRadius: 20,
    width: 320,
    height: 400,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#2E2E4E",
  },
  backCard: {
    position: "absolute",
    top: 0,
    backgroundColor: "#0F3460",
    borderColor: "#4CC9F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: { color: "#888", fontWeight: "bold" },
  dangerBadge: { backgroundColor: "#E94560", padding: 5, borderRadius: 5 },
  dangerText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  wordSection: { flex: 1, justifyContent: "center", alignItems: "center" },
  asteroidName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  label: { color: "#4CC9F0", marginTop: 20, fontSize: 12, letterSpacing: 1 },
  diameterValue: { fontSize: 22, color: "#FFF", fontWeight: "600" },
  footer: { borderTopWidth: 1, borderTopColor: "#2E2E4E", paddingTop: 15 },
  footerHint: { color: "#555", fontSize: 12, textAlign: "center" },

  // Estilos do Verso
  backTitle: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dataRow: { marginBottom: 15 },
  dataLabel: { color: "#888", fontSize: 12 },
  dataValue: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  insightBox: {
    backgroundColor: "#16213E",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  insightTitle: {
    color: "#4CC9F0",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  insightText: { color: "#CCC", fontSize: 13, lineHeight: 18 },
});

export default AsteroidCard;
