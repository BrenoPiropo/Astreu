import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router"; // Importado o Stack
import React from "react";
import type { ColorValue } from "react-native";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ExoplanetDetails() {
  const { id, name, hostname, distance, temp, discovery_year, habitual } =
    useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const getTheme = (t: number): [ColorValue, ColorValue] => {
    if (t > 6000) return ["#00B4D8", "#4CC9F0"];
    if (t > 4500) return ["#FFD60A", "#FFC300"];
    return ["#9A031E", "#5F0F40"];
  };

  const planetTemp = Number(temp);

  return (
    <View style={styles.container}>
      {/* 1. Remove o título da barra superior do sistema */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* HEADER COM O PLANETA GIGANTE */}
        <LinearGradient
          colors={["#1A1E2E", "#05070A"]}
          style={[styles.visualHeader, { paddingTop: insets.top + 20 }]}
        >
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 10 }]} // Ajuste dinâmico do botão
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color="#FFF"
            />
          </TouchableOpacity>

          <View style={styles.planetHeroContainer}>
            <LinearGradient
              colors={getTheme(planetTemp)}
              style={styles.planetHero}
            />
            <View
              style={[styles.glow, { shadowColor: getTheme(planetTemp)[1] }]}
            />
          </View>

          <Text style={styles.mainTitle}>{name}</Text>
          <Text style={styles.mainSubtitle}>SISTEMA {hostname}</Text>
        </LinearGradient>

        {/* INFO CARDS */}
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="ruler" size={24} color="#4CC9F0" />
              <Text style={styles.statLabel}>DISTÂNCIA</Text>
              <Text style={styles.statValue}>{distance} al</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="#4CC9F0"
              />
              <Text style={styles.statLabel}>DESCOBERTO</Text>
              <Text style={styles.statValue}>{discovery_year}</Text>
            </View>
          </View>

          {/* DESCRIÇÃO GERADA */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>RELATÓRIO DE MISSÃO</Text>
            <Text style={styles.descriptionText}>
              {name} é um exoplaneta confirmado que orbita a estrela de tipo
              espectral {hostname}. Situado a uma distância de {distance}{" "}
              anos-luz, este mundo apresenta uma temperatura estelar estimada em{" "}
              {temp}K.{" "}
              {habitual === "true"
                ? "As análises preliminares indicam que o planeta reside na zona habitável de seu sistema, onde a água líquida poderia existir."
                : "As condições atuais sugerem um ambiente hostil para a vida como a conhecemos."}
            </Text>
          </View>

          {/* RODAPÉ CIENTÍFICO */}
          <View
            style={[styles.footerInfo, { marginBottom: insets.bottom + 40 }]}
          >
            <MaterialCommunityIcons
              name="database-check"
              size={16}
              color="#555"
            />
            <Text style={styles.footerText}>
              Dados extraídos do NASA Exoplanet Archive
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070A" },
  visualHeader: {
    height: 480, // Aumentado levemente para dar mais respiro
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#1A1E2E",
    paddingHorizontal: 20, // Padding lateral no header
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 5,
  },
  planetHeroContainer: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  planetHero: {
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: 2,
  },
  glow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 25,
  },
  mainTitle: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  mainSubtitle: {
    color: "#4CC9F0",
    fontSize: 14,
    letterSpacing: 3,
    marginTop: 8,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 24, // Padding lateral maior para o conteúdo
    paddingTop: 30,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#11141D",
    paddingVertical: 25, // Aumentado padding interno vertical
    paddingHorizontal: 15,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  statLabel: { color: "#555", fontSize: 10, fontWeight: "bold", marginTop: 12 },
  statValue: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginTop: 6 },
  descriptionSection: {
    backgroundColor: "#11141D",
    padding: 28, // Padding interno generoso
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 18,
  },
  descriptionText: {
    color: "#BBB",
    fontSize: 16,
    lineHeight: 28, // Melhorado o espaçamento entre linhas
    textAlign: "justify",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 50,
    opacity: 0.4,
  },
  footerText: { color: "#555", fontSize: 12 },
});
