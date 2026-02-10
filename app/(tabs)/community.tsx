import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // --- ESTADOS PRINCIPAIS ---
  const [activeTab, setActiveTab] = useState("estudos");
  const [menuVisible, setMenuVisible] = useState(false); // Estado do Menu Lateral
  const [posts, setPosts] = useState([
    {
      id: "1",
      author: "Breno Piropo",
      type: "article",
      title: "Nebulosas de Emissão",
      content: "Um estudo profundo sobre a composição de gases em Órion...",
      image:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
      pdfName: "estudo_orion.pdf",
      pdfUri: "",
      description: "Mapa detalhado da nebulosa.",
    },
  ]);

  // Modais e Seleção
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Campos do Formulário
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<{ uri: string; name: string } | null>(
    null,
  );

  // --- NAVEGAÇÃO DO MENU ---
  const navigateTo = (path: string) => {
    setMenuVisible(false);
    setTimeout(() => {
      router.push(path as any);
    }, 100);
  };

  // --- FUNÇÕES DE MÍDIA ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!result.canceled) {
      setPdfFile({ uri: result.assets[0].uri, name: result.assets[0].name });
    }
  };

  const handleAddPost = () => {
    if (!imageUri && activeTab === "galeria")
      return alert("Selecione uma foto!");

    const newEntry = {
      id: Math.random().toString(),
      author: "Breno Piropo",
      type: activeTab === "estudos" ? "article" : "photo",
      title: newTitle,
      content: newContent,
      description: newDescription,
      image:
        imageUri ||
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      pdfName: pdfFile?.name || "",
      pdfUri: pdfFile?.uri || "",
    };

    setPosts([newEntry, ...posts]);
    setIsAddModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewDescription("");
    setImageUri(null);
    setPdfFile(null);
  };

  // --- RENDERS ---
  const renderArticle = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>B</Text>
        </View>
        <Text style={styles.authorName}>{item.author}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setSelectedPost(item);
          setIsViewerVisible(true);
        }}
      >
        <Image source={{ uri: item.image }} style={styles.postImage} />
      </TouchableOpacity>
      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{item.title}</Text>
        {item.pdfName && (
          <View style={styles.pdfBadge}>
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={18}
              color="#FF4D4D"
            />
            <Text style={styles.pdfBadgeText}>{item.pdfName}</Text>
          </View>
        )}
        <Text style={styles.postSnippet} numberOfLines={3}>
          {item.content}
        </Text>
        <TouchableOpacity
          style={styles.discussionBtn}
          onPress={() =>
            router.push({ pathname: "/post/[id]", params: { ...item } })
          }
        >
          <MaterialCommunityIcons
            name="chat-processing-outline"
            size={18}
            color="#4CC9F0"
          />
          <Text style={styles.discussionBtnText}>ENTRAR NA DISCUSSÃO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGalleryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.galleryCard}
      onPress={() => {
        setSelectedPost(item);
        setIsViewerVisible(true);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.galleryImage} />
      <View style={styles.galleryOverlay}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarTextSmall}>B</Text>
        </View>
        <Text style={styles.galleryAuthorName}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER COM HAMBURGUER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="menu" size={30} color="#4CC9F0" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ASTREU HUB</Text>

        <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={32}
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
            GALERIA DA COMUNIDADE
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        key={activeTab === "estudos" ? "v" : "h"}
        data={posts.filter((p) =>
          activeTab === "estudos" ? p.type === "article" : p.type === "photo",
        )}
        renderItem={activeTab === "estudos" ? renderArticle : renderGalleryItem}
        keyExtractor={(item) => item.id}
        numColumns={activeTab === "estudos" ? 1 : 2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
      />

      {/* MODAL MENU LATERAL ESQUERDO (SOLICITADO) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.drawerOverlay}>
          <View style={[styles.drawerContent, { paddingTop: insets.top + 20 }]}>
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: "https://github.com/BrenoPiropo.png" }}
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.welcomeText}>Olá,</Text>
              <Text style={styles.userNameText}>Breno Piropo</Text>

              <TouchableOpacity
                style={styles.userButtonMenu}
                onPress={() => navigateTo("/profile")}
              >
                <MaterialCommunityIcons
                  name="account-star"
                  size={18}
                  color="#000"
                />
                <Text style={styles.userButtonText}>
                  Meu Diario Astronomico
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerDivider} />
            <Text style={styles.drawerSectionLabel}>EXPLORAR</Text>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateTo("/exoplanet")}
            >
              <MaterialCommunityIcons name="earth" size={24} color="#4CC9F0" />
              <Text style={styles.drawerItemText}>Exoplanetas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateTo("/stars")}
            >
              <MaterialCommunityIcons
                name="star-shooting"
                size={24}
                color="#4CC9F0"
              />
              <Text style={styles.drawerItemText}>Estrelas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => setMenuVisible(false)}
            >
              <MaterialCommunityIcons name="logout" size={22} color="#FF4D4D" />
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.drawerCloseArea}
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>

      {/* MODAL ADICIONAR */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalFullContent}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View
              style={[styles.addFormContainer, { marginTop: insets.top + 50 }]}
            >
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {activeTab === "estudos" ? "Novo Estudo" : "Nova Foto"}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <MaterialCommunityIcons
                        name="camera-plus"
                        size={40}
                        color="#4CC9F0"
                      />
                      <Text style={styles.uploadText}>Capa/Foto</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {activeTab === "estudos" && (
                  <TouchableOpacity
                    style={styles.pdfPicker}
                    onPress={pickDocument}
                  >
                    <MaterialCommunityIcons
                      name="file-pdf-box"
                      size={24}
                      color={pdfFile ? "#4CC9F0" : "#666"}
                    />
                    <Text
                      style={[
                        styles.pdfPickerText,
                        pdfFile && { color: "#4CC9F0" },
                      ]}
                    >
                      {pdfFile ? pdfFile.name : "Anexar PDF"}
                    </Text>
                  </TouchableOpacity>
                )}
                <TextInput
                  style={styles.input}
                  placeholder={
                    activeTab === "estudos" ? "Título" : "Nome da Obra"
                  }
                  placeholderTextColor="#444"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
                <TextInput
                  style={[styles.input, { height: 100 }]}
                  placeholder="Conteúdo..."
                  placeholderTextColor="#444"
                  multiline
                  value={activeTab === "estudos" ? newContent : newDescription}
                  onChangeText={
                    activeTab === "estudos" ? setNewContent : setNewDescription
                  }
                />
                <TouchableOpacity
                  style={styles.publishBtn}
                  onPress={handleAddPost}
                >
                  <Text style={styles.publishBtnText}>PUBLICAR</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* MODAL VISUALIZADOR */}
      <Modal visible={isViewerVisible} transparent={true} animationType="fade">
        <View style={styles.viewerOverlay}>
          <TouchableOpacity
            style={styles.closeViewer}
            onPress={() => setIsViewerVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          {selectedPost && (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Image
                source={{ uri: selectedPost.image }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <View style={styles.descriptionBox}>
                <Text style={styles.descAuthor}>{selectedPost.author}</Text>
                <Text style={styles.descText}>
                  {selectedPost.type === "article"
                    ? selectedPost.content
                    : selectedPost.description}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  tabBar: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 15 },
  tabItem: { marginRight: 20, paddingBottom: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#4CC9F0" },
  tabText: { color: "#666", fontWeight: "bold", fontSize: 11 },
  tabTextActive: { color: "#4CC9F0" },

  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "row",
  },
  drawerContent: {
    width: 280,
    backgroundColor: "#0B0D17",
    height: "100%",
    padding: 25,
    borderRightWidth: 1,
    borderRightColor: "#1A1E2E",
  },
  drawerCloseArea: { flex: 1 },
  profileSection: { alignItems: "center", marginBottom: 10 },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#4CC9F0",
    padding: 3,
    marginBottom: 10,
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 40 },
  welcomeText: { color: "#666", fontSize: 13 },
  userNameText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  userButtonMenu: {
    backgroundColor: "#4CC9F0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 8,
  },
  userButtonText: { color: "#000", fontSize: 11, fontWeight: "bold" },
  drawerDivider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 25 },
  drawerSectionLabel: {
    color: "#444",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
  },
  drawerItemText: { color: "#DDD", fontSize: 16, fontWeight: "500" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: "auto",
    marginBottom: 20,
  },
  logoutText: { color: "#FF4D4D", fontSize: 15, fontWeight: "bold" },

  // Posts & Gallery
  postCard: {
    backgroundColor: "#11141D",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  postHeader: { flexDirection: "row", alignItems: "center", padding: 15 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CC9F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { fontWeight: "bold", fontSize: 12 },
  authorName: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  postImage: { width: "100%", height: 200 },
  postInfo: { padding: 15 },
  postTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  pdfBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4D4D15",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  pdfBadgeText: {
    color: "#FF4D4D",
    fontSize: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  postSnippet: { color: "#BBB", fontSize: 13, marginTop: 10 },
  discussionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  discussionBtnText: {
    color: "#4CC9F0",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
  },
  galleryCard: {
    flex: 1,
    height: 180,
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  galleryImage: { width: "100%", height: "100%" },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CC9F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  avatarTextSmall: { fontSize: 10, fontWeight: "bold" },
  galleryAuthorName: { color: "#FFF", fontSize: 10 },

  // Modais
  modalFullContent: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)" },
  addFormContainer: {
    backgroundColor: "#11141D",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  formTitle: { color: "#4CC9F0", fontSize: 18, fontWeight: "bold" },
  uploadArea: {
    height: 140,
    backgroundColor: "#05070A",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#4CC9F0",
    overflow: "hidden",
  },
  previewImage: { width: "100%", height: "100%" },
  uploadText: { color: "#4CC9F0", fontSize: 12, marginTop: 5 },
  pdfPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#05070A",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  pdfPickerText: { color: "#666", fontSize: 13, marginLeft: 10 },
  input: {
    backgroundColor: "#05070A",
    borderRadius: 12,
    color: "#FFF",
    padding: 15,
    marginTop: 15,
  },
  publishBtn: {
    backgroundColor: "#4CC9F0",
    padding: 18,
    borderRadius: 15,
    marginTop: 25,
    alignItems: "center",
  },
  publishBtnText: { color: "#000", fontWeight: "bold" },
  viewerOverlay: { flex: 1, backgroundColor: "black" },
  closeViewer: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  fullImage: { width: "100%", height: "70%" },
  descriptionBox: {
    position: "absolute",
    bottom: 50,
    padding: 25,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  descAuthor: { color: "#4CC9F0", fontWeight: "bold", marginBottom: 5 },
  descText: { color: "#FFF", fontSize: 14, lineHeight: 22 },
});
