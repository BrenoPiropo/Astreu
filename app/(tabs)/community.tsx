import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Importando os estilos e o novo componente da Galeria
import GalleryTab from "./gallerytab"; // Ajuste o caminho conforme sua estrutura
import { styles } from "./styles/CommunityStyles";

const BASE_URL = "http://10.0.2.2:3000";
const API_URL = `${BASE_URL}/posts`;
const UPLOADS_URL = `${BASE_URL}/uploads`;

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"estudos" | "galeria">("estudos");
  const [menuVisible, setMenuVisible] = useState(false);

  // --- BUSCA DE DADOS ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [userJson, response] = await Promise.all([
        AsyncStorage.getItem("@astreuhub_user"),
        axios.get(API_URL),
      ]);

      if (userJson) setUserData(JSON.parse(userJson));
      setPosts(response.data);
    } catch (e) {
      Alert.alert("Erro de Conexão", "Não foi possível sincronizar com o Hub.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  // --- NAVEGAÇÃO ---
  const handleOpenDetail = (item: any) => {
    // Se for uma foto favoritada do dataset (isDataset), decidimos o que fazer
    if (item.isDataset) {
      // Por enquanto, não abre detalhe de favorito ou você pode criar uma rota para isso
      return;
    }

    router.push({
      pathname: `/post/${item.id}` as any,
      params: {
        title: item.titulo,
        author: item.usuario?.nome || "Astrônomo",
        content: item.conteudo,
        image: `${UPLOADS_URL}/${item.url_midia}`,
        pdfUri: item.url_pdf ? `${UPLOADS_URL}/${item.url_pdf}` : "null",
        pdfName: item.url_pdf ? "Relatorio_Missao.pdf" : "null",
      },
    });
  };

  // --- COMPONENTE INTERNO: ITEM DE ESTUDO ---
  const PostItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handleOpenDetail(item)}
      activeOpacity={0.9}
    >
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(item.usuario?.nome?.charAt(0) || "A").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.authorName}>
          {item.usuario?.nome || "Astrônomo"}
        </Text>
      </View>

      <Image
        source={{
          uri: `${UPLOADS_URL}/${item.url_midia}`.replace(
            "localhost",
            "10.0.2.2",
          ),
        }}
        style={styles.postImage}
        resizeMode="cover"
      />

      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{item.titulo}</Text>
        {item.url_pdf && (
          <View style={styles.pdfBadge}>
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={14}
              color="#FF4D4D"
            />
            <Text style={styles.pdfBadgeText}>ESTUDO ANEXADO</Text>
          </View>
        )}
        <Text style={styles.postSnippet} numberOfLines={2}>
          {item.conteudo}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="menu" size={28} color="#4CC9F0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ASTREU HUB</Text>
        <TouchableOpacity onPress={() => router.push("/create-post")}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={28}
            color="#4CC9F0"
          />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab("estudos")}
          style={[styles.tabItem, activeTab === "estudos" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "estudos" && styles.tabTextActive,
            ]}
          >
            ESTUDOS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("galeria")}
          style={[styles.tabItem, activeTab === "galeria" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "galeria" && styles.tabTextActive,
            ]}
          >
            GALERIA
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO DINÂMICO */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#4CC9F0" />
        </View>
      ) : activeTab === "estudos" ? (
        <FlatList
          data={posts.filter((p) => p.tipo === "article")}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostItem item={item} />}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ color: "#444", textAlign: "center", marginTop: 50 }}>
              Nenhum artigo científico encontrado.
            </Text>
          }
        />
      ) : (
        /* NOVO COMPONENTE SEPARADO */
        <GalleryTab
          posts={posts}
          uploadsUrl={UPLOADS_URL}
          onOpenDetail={handleOpenDetail}
        />
      )}

      {/* MODAL MENU */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={styles.drawerOverlay}>
          <View style={[styles.drawerContent, { paddingTop: insets.top + 20 }]}>
            <Text style={styles.userNameText}>
              Olá, {userData?.nome || "Explorador"}
            </Text>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                AsyncStorage.removeItem("@astreuhub_user");
                router.replace("/LoginScreen");
              }}
            >
              <Text style={styles.logoutText}>Sair da Missão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={{ color: "#4CC9F0" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
