import React, { useEffect, useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Loading } from "../components/Loading";
import { ApodResponse, getApod } from "../services/api";

export default function ApodScreen() {
  const [data, setData] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const result = await getApod();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
        {/* Cabeçalho da Tela */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>NASA APOD</Text>
          <Text style={styles.headerTitle}>Foto do Dia</Text>
        </View>

        <Image
          source={{ uri: data?.url }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{data?.date}</Text>
          </View>

          <Text style={styles.title}>{data?.title}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>EXPLICAÇÃO CIENTÍFICA</Text>
          <Text style={styles.description}>{data?.explanation}</Text>

          {/* Ilustração representativa de como a NASA captura imagens astronômicas */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0B0D17" },
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  headerSubtitle: {
    color: "#4CC9F0",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  image: { width: "100%", height: 450, backgroundColor: "#1A1E2E" },
  content: {
    padding: 25,
    marginTop: -30,
    backgroundColor: "#0B0D17",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dateBadge: {
    backgroundColor: "#1A1E2E",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 15,
  },
  dateText: { color: "#4CC9F0", fontSize: 12, fontWeight: "bold" },
  title: { color: "#FFF", fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 20 },
  sectionLabel: {
    color: "#555",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  description: {
    color: "#BBB",
    lineHeight: 26,
    fontSize: 16,
    textAlign: "justify",
  },
});
