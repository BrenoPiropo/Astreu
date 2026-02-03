import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- INTERFACES ---
interface UserPhoto {
  id: string;
  uri: string;
  date: string;
  description: string;
}

interface StudyNote {
  id: string;
  text: string;
  date: string;
}

export default function ProfileScreen() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);

  // Controles de Modais
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [photoInputModalVisible, setPhotoInputModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Estados de Edição e Criação
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteText, setCurrentNoteText] = useState("");
  const [tempPhotoUri, setTempPhotoUri] = useState("");
  const [tempPhotoDesc, setTempPhotoDesc] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  // --- CARREGAMENTO DE DADOS ---
  async function loadUserData() {
    try {
      const savedPhotos = await AsyncStorage.getItem("@minerva:photos");
      const savedNotes = await AsyncStorage.getItem("@minerva:notes");
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    }
  }

  // --- LÓGICA DE FOTOS ---
  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Erro",
        "Precisamos de acesso à câmera para registrar o cosmos!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setTempPhotoUri(result.assets[0].uri);
      setPhotoInputModalVisible(true);
    }
  }

  async function saveNewPhoto() {
    const newPhoto: UserPhoto = {
      id: String(Date.now()),
      uri: tempPhotoUri,
      date: new Date().toLocaleDateString("pt-BR"),
      description: tempPhotoDesc || "Sem descrição registrada.",
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    await AsyncStorage.setItem("@minerva:photos", JSON.stringify(updated));
    setPhotoInputModalVisible(false);
    setTempPhotoDesc("");
  }

  // --- LÓGICA DE NOTAS ---
  async function saveNewNote() {
    if (!currentNoteText.trim()) return;
    const newNote: StudyNote = {
      id: String(Date.now()),
      text: currentNoteText,
      date: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    await AsyncStorage.setItem("@minerva:notes", JSON.stringify(updated));
    setCurrentNoteText("");
    setNoteModalVisible(false);
  }

  // --- EXCLUSÃO E EDIÇÃO ---
  const handleDelete = () => {
    Alert.alert("Excluir", "Deseja remover este registro do seu espaço?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          if (selectedItem.uri) {
            const updated = photos.filter((p) => p.id !== selectedItem.id);
            setPhotos(updated);
            await AsyncStorage.setItem(
              "@minerva:photos",
              JSON.stringify(updated),
            );
          } else {
            const updated = notes.filter((n) => n.id !== selectedItem.id);
            setNotes(updated);
            await AsyncStorage.setItem(
              "@minerva:notes",
              JSON.stringify(updated),
            );
          }
          setViewModalVisible(false);
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    if (selectedItem.uri) {
      const updated = photos.map((p) =>
        p.id === selectedItem.id ? { ...p, description: tempPhotoDesc } : p,
      );
      setPhotos(updated);
      await AsyncStorage.setItem("@minerva:photos", JSON.stringify(updated));
    } else {
      const updated = notes.map((n) =>
        n.id === selectedItem.id ? { ...n, text: currentNoteText } : n,
      );
      setNotes(updated);
      await AsyncStorage.setItem("@minerva:notes", JSON.stringify(updated));
    }
    setIsEditing(false);
    setViewModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#4CC9F0" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>MEU DIARIO DE BORDO ASTRONOMICO</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* PERFIL USER */}
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name="rocket-launch-outline"
              size={40}
              color="#4CC9F0"
            />
          </View>
          <Text style={styles.userName}>Explorador Astronomy</Text>
          <Text style={styles.userStats}>
            {photos.length} Fotos • {notes.length} Notas
          </Text>
        </View>

        {/* SEÇÃO DE NOTAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>NOTAS DE ESTUDO</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setIsEditing(false);
                setCurrentNoteText("");
                setNoteModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.noteCard}
              onPress={() => {
                setSelectedItem(note);
                setCurrentNoteText(note.text);
                setIsEditing(false);
                setViewModalVisible(true);
              }}
            >
              <Text style={styles.itemDate}>{note.date}</Text>
              <Text style={styles.itemPreview} numberOfLines={2}>
                {note.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEÇÃO DE FOTOS (GALERIA) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MEU ESPAÇO ASTRONÔMICO</Text>
            <TouchableOpacity style={styles.addBtn} onPress={handlePickPhoto}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.photoGrid}>
            {photos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                style={styles.photoThumb}
                onPress={() => {
                  setSelectedItem(photo);
                  setTempPhotoDesc(photo.description);
                  setIsEditing(false);
                  setViewModalVisible(true);
                }}
              >
                <Image source={{ uri: photo.uri }} style={styles.imgThumb} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* --- MODAIS --- */}

      {/* 1. Modal para Criar Nota */}
      <Modal visible={noteModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Nova Anotação</Text>
            <TextInput
              style={styles.inputArea}
              multiline
              placeholder="O que você aprendeu?"
              placeholderTextColor="#555"
              onChangeText={setCurrentNoteText}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <Text style={{ color: "#666" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={saveNewNote}>
                <Text style={styles.primaryBtnText}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Modal para Descrever Foto tirada */}
      <Modal visible={photoInputModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Image source={{ uri: tempPhotoUri }} style={styles.previewImg} />
            <TextInput
              style={styles.inputArea}
              multiline
              placeholder="Descreva sua observação..."
              placeholderTextColor="#555"
              onChangeText={setTempPhotoDesc}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={saveNewPhoto}>
              <Text style={styles.primaryBtnText}>REGISTRAR FOTO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Modal de Visualização / Edição / Exclusão */}
      <Modal visible={viewModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.viewContainer}>
            <View style={styles.viewHeader}>
              <TouchableOpacity onPress={handleDelete}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={26}
                  color="#FF5555"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={28}
                  color="#4CC9F0"
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedItem?.uri && (
                <Image
                  source={{ uri: selectedItem.uri }}
                  style={styles.fullImg}
                  resizeMode="contain"
                />
              )}
              <View style={styles.viewContent}>
                <Text style={styles.detailDate}>{selectedItem?.date}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editArea}
                    multiline
                    value={selectedItem?.uri ? tempPhotoDesc : currentNoteText}
                    onChangeText={
                      selectedItem?.uri ? setTempPhotoDesc : setCurrentNoteText
                    }
                  />
                ) : (
                  <Text style={styles.detailText}>
                    {selectedItem?.uri
                      ? selectedItem.description
                      : selectedItem?.text}
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
                >
                  <MaterialCommunityIcons
                    name={isEditing ? "check" : "pencil"}
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.editBtnText}>
                    {isEditing ? "CONFIRMAR" : "EDITAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070A" },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  navTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 2,
  },
  userHeader: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#11141D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CC9F0",
    marginBottom: 10,
  },
  userName: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  userStats: { color: "#4CC9F0", fontSize: 12, marginTop: 5 },

  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  addBtn: { backgroundColor: "#4CC9F0", padding: 8, borderRadius: 8 },

  noteCard: {
    backgroundColor: "#11141D",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4CC9F0",
  },
  itemDate: {
    color: "#4CC9F0",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPreview: { color: "#BBB", fontSize: 14 },

  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoThumb: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  imgThumb: { width: "100%", height: "100%" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    padding: 20,
  },
  modalBody: { backgroundColor: "#11141D", padding: 20, borderRadius: 20 },
  modalTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputArea: {
    backgroundColor: "#05070A",
    color: "#FFF",
    padding: 15,
    borderRadius: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  primaryBtn: {
    backgroundColor: "#4CC9F0",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  primaryBtnText: { color: "#000", fontWeight: "bold" },
  previewImg: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },

  viewContainer: { flex: 1, marginTop: 40 },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  fullImg: { width: "100%", height: 350, borderRadius: 20 },
  viewContent: { padding: 20 },
  detailDate: { color: "#4CC9F0", fontSize: 12, fontWeight: "bold" },
  detailText: { color: "#BBB", fontSize: 16, lineHeight: 26, marginTop: 15 },
  editArea: {
    backgroundColor: "#11141D",
    color: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#4CC9F0",
  },
  editBtn: {
    backgroundColor: "#4CC9F0",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    justifyContent: "center",
    gap: 10,
  },
  editBtnText: { color: "#000", fontWeight: "bold" },
});
