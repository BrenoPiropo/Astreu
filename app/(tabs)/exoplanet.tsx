import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import type { ColorValue } from "react-native";
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loading } from "../../components/Loading";
import { Exoplanet, getExoplanets } from "../../services/api";

const { width } = Dimensions.get("window");

export default function ExoplanetsScreen() {
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    loadPlanets();
  }, []);

  async function loadPlanets() {
    try {
      const data = await getExoplanets();
      setPlanets(data);
    } catch (error) {
      console.error("Erro ao carregar exoplanetas:", error);
    } finally {
      setLoading(false);
    }
  }

  // Define o tema visual (cores) com base na temperatura da estrela hospedeira
  const getVisualTheme = (temp: number) => {
    if (temp > 6000)
      return {
        colors: ["#00B4D8", "#4CC9F0"] as [ColorValue, ColorValue],
        label: "Estrela Azul",
      };
    if (temp > 4500)
      return {
        colors: ["#FFD60A", "#FFC300"] as [ColorValue, ColorValue],
        label: "Estrela Amarela",
      };
    if (temp > 0)
      return {
        colors: ["#9A031E", "#5F0F40"] as [ColorValue, ColorValue],
        label: "Anã Vermelha",
      };
    return {
      colors: ["#2B2D42", "#8D99AE"] as [ColorValue, ColorValue],
      label: "N/A",
    };
  };

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />

      {/* CABEÇALHO DA TELA */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>EXPLORADOR DE MUNDOS</Text>
          <Text style={styles.headerTitle}>Exoplanetas</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="magnify" size={24} color="#4CC9F0" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={planets}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        renderItem={({ item }) => {
          const theme = getVisualTheme(item.temp);

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/wiki/[id]",
                  params: {
                    id: item.name,
                    name: item.name,
                    hostname: item.hostname,
                    distance: item.distance,
                    temp: item.temp,
                    discovery_year: item.discovery_year,
                    habitual: String(item.habitual),
                  },
                })
              }
            >
              <View style={styles.cardTop}>
                {/* REPRESENTAÇÃO VISUAL DO PLANETA */}
                <View style={styles.planetWrapper}>
                  <LinearGradient
                    colors={theme.colors}
                    style={styles.planetCircle}
                  />
                </View>

                <View style={styles.nameContainer}>
                  <Text style={styles.planetName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.hostnameRow}>
                    <MaterialCommunityIcons
                      name="star-shooting"
                      size={14}
                      color="#4CC9F0"
                    />
                    <Text style={styles.hostname}>{item.hostname}</Text>
                  </View>
                </View>

                {item.habitual && (
                  <View style={styles.habitableBadge}>
                    <MaterialCommunityIcons
                      name="leaf"
                      size={12}
                      color="#4CAF50"
                    />
                  </View>
                )}
              </View>

              <View style={styles.divider} />

              {/* INFO GRID (DADOS TÉCNICOS RÁPIDOS) */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>DISTÂNCIA</Text>
                  <Text style={styles.infoValue}>{item.distance} al</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>DESCOBERTA</Text>
                  <Text style={styles.infoValue}>{item.discovery_year}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>STATUS</Text>
                  <Text style={[styles.infoValue, { color: theme.colors[1] }]}>
                    {theme.label}
                  </Text>
                </View>
              </View>

              <View style={styles.footerAction}>
                <Text style={styles.footerActionText}>
                  VER RELATÓRIO COMPLETO
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={14}
                  color="#333"
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  headerTitle: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  filterButton: {
    backgroundColor: "#11141D",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  card: {
    backgroundColor: "#11141D",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1A1E2E",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  planetWrapper: {
    shadowColor: "#4CC9F0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  planetCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameContainer: {
    flex: 1,
  },
  planetName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  hostnameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  hostname: {
    color: "#4CC9F0",
    fontSize: 12,
    textTransform: "uppercase",
  },
  habitableBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    padding: 8,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#1A1E2E",
    marginVertical: 15,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: "#555",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  infoValue: {
    color: "#DDD",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 5,
    opacity: 0.6,
  },
  footerActionText: {
    color: "#888",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
