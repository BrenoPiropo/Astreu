import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // --- ESTADOS ---
  const [userData, setUserData] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [viewNoteModalVisible, setViewNoteModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  // ESTADOS DO MODAL DE FOTO
  const [isPhotoViewerVisible, setIsPhotoViewerVisible] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState("");

  const [currentNoteText, setCurrentNoteText] = useState("");
  const [currentTaskTitle, setCurrentTaskTitle] = useState("");

  // --- 1. CARREGAR DADOS DO BACKEND ---
  const loadBackendData = async () => {
    try {
      setLoading(true);
      const userJson = await AsyncStorage.getItem("@astreuhub_user");
      if (!userJson) return;
      const user = JSON.parse(userJson);
      setUserData(user);

      const [resNotas, resMetas] = await Promise.all([
        axios.get(`http://10.0.2.2:3000/diario`),
        axios.get(`http://10.0.2.2:3000/diario/metas/${user.id}`),
      ]);

      const minhasNotas = resNotas.data
        .filter((d: any) => d.usuario?.id === user.id)
        .map((n: any) => ({
          id: n.id,
          text: n.relato,
          date: n.data_observacao.split("T")[0],
          fotos: n.fotos || [],
        }));

      setNotes(minhasNotas);
      setTasks(resMetas.data);
    } catch (error) {
      console.error("Erro na sincronização:", error);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBackendData();
    }, []),
  );

  // --- 2. PERSISTÊNCIA DE NOTAS E FOTOS (MYSQL) ---
  async function saveNote(base64Photo?: string) {
    try {
      setLoading(true);
      const payload: any = {
        titulo_observacao: `Log de ${userData?.nome || "Astrônomo"}`,
        relato: base64Photo ? "Captura visual" : currentNoteText,
        data_observacao: new Date(selectedDate).toISOString(),
        usuario: { id: userData?.id },
      };

      if (base64Photo) {
        payload.fotos = [{ url_foto: base64Photo }];
      }

      await axios.post("http://10.0.2.2:3000/diario", payload);
      setNoteModalVisible(false);
      setCurrentNoteText("");
      loadBackendData();
    } catch (e) {
      Alert.alert("Erro", "Erro ao salvar no banco.");
    } finally {
      setLoading(false);
    }
  }

  // --- 3. FUNÇÃO PARA TIRAR FOTO (BASE64) ---
  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.4,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      saveNote(base64Image);
    }
  };

  // --- 4. PERSISTÊNCIA DE METAS ---
  async function saveNewTask() {
    if (!currentTaskTitle.trim()) return;
    try {
      await axios.post("http://10.0.2.2:3000/diario/metas", {
        titulo: currentTaskTitle,
        status: "aberto",
        usuario: { id: userData?.id },
      });
      setCurrentTaskTitle("");
      setTaskModalVisible(false);
      loadBackendData();
    } catch (e) {
      Alert.alert("Erro", "Erro ao criar meta.");
    }
  }

  async function toggleTaskStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === "concluída" ? "aberto" : "concluída";
    try {
      await axios.patch(`http://10.0.2.2:3000/diario/metas/${id}`, {
        status: newStatus,
      });
      loadBackendData();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteTask(id: number) {
    try {
      await axios.delete(`http://10.0.2.2:3000/diario/metas/${id}`);
      loadBackendData();
    } catch (e) {
      console.error(e);
    }
  }

  // --- LÓGICA DO CALENDÁRIO E GALERIA ---
  const dailyNote = notes.find((n) => n.date === selectedDate);

  const dailyPhotos = useMemo(() => {
    return notes
      .filter((n) => n.date === selectedDate)
      .flatMap((n) => n.fotos || [])
      .filter((f) => f && f.url_foto);
  }, [notes, selectedDate]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    notes.forEach((n) => {
      marks[n.date] = { marked: true, dotColor: "#4CC9F0" };
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: "#4CC9F0",
    };
    return marks;
  }, [notes, selectedDate]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color="#4CC9F0"
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>COMANDO CENTRAL</Text>
          <Text style={styles.headerTitle}>
            {userData?.nome?.toUpperCase() || "CARREGANDO..."}
          </Text>
        </View>
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${userData?.nome}&background=4CC9F0&color=000`,
          }}
          style={styles.profileAvatar}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && (
          <ActivityIndicator color="#4CC9F0" style={{ marginBottom: 15 }} />
        )}

        <Calendar
          theme={{
            backgroundColor: "#05070A",
            calendarBackground: "#11141D",
            textSectionTitleColor: "#4CC9F0",
            selectedDayBackgroundColor: "#4CC9F0",
            selectedDayTextColor: "#000",
            todayTextColor: "#4CC9F0",
            dayTextColor: "#FFF",
            monthTextColor: "#FFF",
            arrowColor: "#4CC9F0",
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={styles.calendar}
        />

        {/* METAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metas mensais</Text>
            <TouchableOpacity
              style={styles.addBtnSmall}
              onPress={() => setTaskModalVisible(true)}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity
                onPress={() => toggleTaskStatus(task.id, task.status)}
                style={styles.taskCheck}
              >
                <MaterialCommunityIcons
                  name={
                    task.status === "concluída"
                      ? "check-circle"
                      : "circle-outline"
                  }
                  size={22}
                  color={task.status === "concluída" ? "#00C853" : "#444"}
                />
                <Text
                  style={[
                    styles.taskText,
                    task.status === "concluída" && styles.taskDone,
                  ]}
                >
                  {task.titulo}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color="#FF5252"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* DIA SELECIONADO */}
        <View style={styles.dayBox}>
          <Text style={styles.selectedDateText}>{selectedDate}</Text>

          <TouchableOpacity
            style={styles.noteContainer}
            onPress={() => dailyNote && setViewNoteModalVisible(true)}
          >
            <View style={styles.boxHeader}>
              <Text style={styles.boxLabel}>Observação do dia</Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentNoteText(dailyNote?.text || "");
                  setNoteModalVisible(true);
                }}
              >
                <MaterialCommunityIcons
                  name="pencil-plus"
                  size={20}
                  color="#4CC9F0"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.notePreview} numberOfLines={4}>
              {dailyNote?.text || "Nenhuma observação registrada..."}
            </Text>
          </TouchableOpacity>

          {/* GALERIA */}
          <View style={styles.photoSection}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxLabel}>Minha galeria</Text>
              <TouchableOpacity
                onPress={handleTakePicture}
                style={styles.cameraIcon}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {dailyPhotos.length > 0 ? (
                dailyPhotos.map((foto: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedPhotoUrl(foto?.url_foto);
                      setIsPhotoViewerVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: foto?.url_foto }}
                      style={styles.dailyPhoto}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noPhotoText}>
                  Nenhuma imagem capturada...
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* MODAL TASK */}
      <Modal visible={taskModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Nova meta mensal</Text>
            <TextInput
              style={styles.input}
              value={currentTaskTitle}
              onChangeText={setCurrentTaskTitle}
              placeholder="Ex: Estudar Propulsão Iônica"
              placeholderTextColor="#444"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveNewTask}>
              <Text style={styles.saveBtnText}>SALVAR</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL NOTE */}
      <Modal visible={noteModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Observação</Text>
            <TextInput
              style={[styles.input, { minHeight: 120 }]}
              multiline
              value={currentNoteText}
              onChangeText={setCurrentNoteText}
              placeholder="Relate suas descobertas..."
              placeholderTextColor="#444"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={() => saveNote()}>
              <Text style={styles.saveBtnText}>enviar observação</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL VIEW NOTA */}
      <Modal visible={viewNoteModalVisible} transparent animationType="fade">
        <View style={styles.viewerOverlay}>
          <View style={styles.viewerContent}>
            <Text style={styles.modalTitle}>Visualizando do Banco</Text>
            <ScrollView>
              <Text style={styles.fullText}>{dailyNote?.text}</Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setViewNoteModalVisible(false)}
              style={styles.saveBtn}
            >
              <Text style={styles.saveBtnText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NOVO MODAL: VISUALIZADOR DE FOTOS EM TAMANHO REAL */}
      <Modal visible={isPhotoViewerVisible} transparent animationType="fade">
        <View style={styles.photoViewerContainer}>
          <TouchableOpacity
            style={styles.closePhotoViewer}
            onPress={() => setIsPhotoViewerVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedPhotoUrl }}
            style={styles.fullScreenPhoto}
            resizeMode="contain"
          />
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
  headerTitleContainer: { alignItems: "center" },
  headerSubtitle: { color: "#4CC9F0", fontSize: 9, letterSpacing: 2 },
  headerTitle: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4CC9F0",
  },
  calendar: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: "#4CC9F0", fontSize: 11, fontWeight: "bold" },
  addBtnSmall: { backgroundColor: "#4CC9F0", padding: 4, borderRadius: 6 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#11141D",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  taskCheck: { flexDirection: "row", alignItems: "center", flex: 1 },
  taskText: { color: "#FFF", marginLeft: 12 },
  taskDone: { textDecorationLine: "line-through", color: "#444" },
  dayBox: {
    padding: 25,
    backgroundColor: "#11141D",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
  },
  selectedDateText: {
    color: "#4CC9F0",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noteContainer: {
    backgroundColor: "#05070A",
    padding: 20,
    borderRadius: 25,
    minHeight: 130,
    marginBottom: 20,
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  boxLabel: { color: "#4CC9F0", fontSize: 10, fontWeight: "bold" },
  notePreview: { color: "#BBB", fontSize: 15 },
  photoSection: { marginTop: 10 },
  cameraIcon: { backgroundColor: "#4CC9F0", padding: 6, borderRadius: 8 },
  dailyPhoto: { width: 110, height: 110, borderRadius: 20, marginRight: 15 },
  noPhotoText: { color: "#444", fontSize: 12, marginTop: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalBody: {
    backgroundColor: "#11141D",
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    color: "#FFF",
    backgroundColor: "#05070A",
    borderRadius: 15,
    padding: 18,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#4CC9F0",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  saveBtnText: { fontWeight: "bold", color: "#000" },
  viewerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },
  viewerContent: {
    backgroundColor: "#11141D",
    borderRadius: 30,
    padding: 30,
    maxHeight: "80%",
  },
  fullText: { color: "#FFF", fontSize: 16, lineHeight: 24, marginTop: 20 },

  // ESTILOS DO NOVO MODAL DE FOTO
  photoViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closePhotoViewer: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 10,
  },
  fullScreenPhoto: {
    width: "100%",
    height: "80%",
  },
});
