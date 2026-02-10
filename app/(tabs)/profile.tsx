import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
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
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Fev.",
    "Mar.",
    "Abr.",
    "Mai.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

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
interface StudyTask {
  id: string;
  title: string;
  status: "aberto" | "concluída";
}

export default function ProfileScreen() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [viewNoteModalVisible, setViewNoteModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [photoInputModalVisible, setPhotoInputModalVisible] = useState(false);

  const [currentNoteText, setCurrentNoteText] = useState("");
  const [currentTaskTitle, setCurrentTaskTitle] = useState("");
  const [tempPhotoUri, setTempPhotoUri] = useState("");

  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const [p, n, t] = await Promise.all([
        AsyncStorage.getItem("@astreu:photos"),
        AsyncStorage.getItem("@astreu:notes"),
        AsyncStorage.getItem("@astreu:tasks"),
      ]);
      if (p) setPhotos(JSON.parse(p));
      if (n) setNotes(JSON.parse(n));
      if (t) setTasks(JSON.parse(t));
    } catch (e) {
      console.error(e);
    }
  }

  const dailyNote = notes.find((n) => n.date === selectedDate);
  const dailyPhotos = photos.filter((p) => p.date === selectedDate);

  const markedDates = useMemo(() => {
    const marks: any = {};
    notes.forEach((n) => {
      marks[n.date] = { marked: true, dotColor: "#4CC9F0" };
    });
    photos.forEach((p) => {
      marks[p.date] = { ...marks[p.date], marked: true, dotColor: "#4CC9F0" };
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: "#4CC9F0",
    };
    return marks;
  }, [notes, photos, selectedDate]);

  // --- FUNÇÕES DE METAS (TASKS) ---
  async function saveNewTask() {
    if (!currentTaskTitle.trim()) return;
    const newTask: StudyTask = {
      id: String(Date.now()),
      title: currentTaskTitle,
      status: "aberto",
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    await AsyncStorage.setItem("@astreu:tasks", JSON.stringify(updated));
    setCurrentTaskTitle("");
    setTaskModalVisible(false);
  }

  async function toggleTaskStatus(id: string) {
    const updated = tasks.map((t) =>
      t.id === id
        ? { ...t, status: t.status === "concluída" ? "aberto" : "concluída" }
        : t,
    );
    setTasks(updated as StudyTask[]);
    await AsyncStorage.setItem("@astreu:tasks", JSON.stringify(updated));
  }

  async function deleteTask(id: string) {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await AsyncStorage.setItem("@astreu:tasks", JSON.stringify(updated));
  }

  // --- FUNÇÕES DE NOTAS ---
  async function saveNote() {
    if (!currentNoteText.trim()) return;
    const newNote: StudyNote = {
      id: String(Date.now()),
      text: currentNoteText,
      date: selectedDate,
    };
    const filtered = notes.filter((n) => n.date !== selectedDate);
    const updated = [newNote, ...filtered];
    setNotes(updated);
    await AsyncStorage.setItem("@astreu:notes", JSON.stringify(updated));
    setNoteModalVisible(false);
  }

  async function handlePickPhoto() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newPhoto: UserPhoto = {
        id: String(Date.now()),
        uri: result.assets[0].uri,
        date: selectedDate,
        description: "",
      };
      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      await AsyncStorage.setItem("@astreu:photos", JSON.stringify(updated));
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color="#4CC9F0"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOGBOOK</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Calendar
          theme={{
            backgroundColor: "#05070A",
            calendarBackground: "#11141D",
            textSectionTitleColor: "#4CC9F0",
            selectedDayBackgroundColor: "#4CC9F0",
            selectedDayTextColor: "#000",
            todayTextColor: "#4CC9F0",
            dayTextColor: "#FFF",
            textDisabledColor: "#333",
            monthTextColor: "#FFF",
            arrowColor: "#4CC9F0",
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={styles.calendar}
        />

        {/* Seção de Metas Corrigida */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>METAS DO MÊS</Text>
            <TouchableOpacity
              style={styles.addBtnSmall}
              onPress={() => setTaskModalVisible(true)}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {tasks.map((task) => (
            <View key={task.id} style={styles.taskMiniCard}>
              <TouchableOpacity
                onPress={() => toggleTaskStatus(task.id)}
                style={styles.taskCheckArea}
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
                    styles.taskMiniText,
                    task.status === "concluída" && styles.doneText,
                  ]}
                >
                  {task.title}
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

        <View style={styles.dayContainer}>
          <Text style={styles.dateLabel}>
            {new Date(selectedDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
            })}
          </Text>

          <TouchableOpacity
            style={styles.dayNoteBox}
            onPress={() => dailyNote && setViewNoteModalVisible(true)}
          >
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>NOTA DE ESTUDO</Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentNoteText(dailyNote?.text || "");
                  setNoteModalVisible(true);
                }}
              >
                <MaterialCommunityIcons
                  name="pencil-plus"
                  size={22}
                  color="#4CC9F0"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.dayText} numberOfLines={5}>
              {dailyNote?.text || "Nenhuma anotação registrada..."}
            </Text>
          </TouchableOpacity>

          <View style={styles.photoSection}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>ESPAÇO ASTRONÔMICO</Text>
              <TouchableOpacity
                onPress={handlePickPhoto}
                style={styles.cameraBtn}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {dailyPhotos.map((p) => (
                <View key={p.id} style={styles.photoWrapper}>
                  <Image source={{ uri: p.uri }} style={styles.dailyImg} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* NOVO MODAL PARA ADICIONAR METAS */}
      <Modal visible={taskModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Meta</Text>
              <TouchableOpacity onPress={() => setTaskModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ex: Estudar Constelações..."
              placeholderTextColor="#444"
              value={currentTaskTitle}
              onChangeText={setCurrentTaskTitle}
              autoFocus
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveNewTask}>
              <Text style={styles.saveBtnText}>ADICIONAR META</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL DE NOTA (RESPONSIVO) */}
      <Modal visible={noteModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anotação do Dia</Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.3 }}>
              <TextInput
                style={styles.input}
                multiline
                value={currentNoteText}
                onChangeText={setCurrentNoteText}
                placeholder="Relate seus avanços..."
                placeholderTextColor="#444"
              />
            </ScrollView>
            <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
              <Text style={styles.saveBtnText}>REGISTRAR LOG</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL DE VISUALIZAÇÃO */}
      <Modal visible={viewNoteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.modalContentLarge}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exploração Detalhada</Text>
              <TouchableOpacity onPress={() => setViewNoteModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#4CC9F0"
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.fullNoteText}>{dailyNote?.text}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.editNoteFloatingBtn}
              onPress={() => {
                setViewNoteModalVisible(false);
                setNoteModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#000" />
              <Text style={{ fontWeight: "bold", marginLeft: 5 }}>EDITAR</Text>
            </TouchableOpacity>
          </View>
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
    letterSpacing: 3,
    fontWeight: "bold",
    fontSize: 14,
  },
  calendar: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    overflow: "hidden",
  },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#4CC9F0",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  addBtnSmall: { backgroundColor: "#4CC9F0", padding: 4, borderRadius: 6 },
  taskMiniCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#11141D",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  taskCheckArea: { flexDirection: "row", alignItems: "center", flex: 1 },
  taskMiniText: { color: "#FFF", marginLeft: 10, fontSize: 13 },
  doneText: { textDecorationLine: "line-through", color: "#444" },
  dayContainer: {
    padding: 20,
    backgroundColor: "#11141D",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  dateLabel: {
    color: "#4CC9F0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  dayNoteBox: {
    backgroundColor: "#05070A",
    padding: 18,
    borderRadius: 20,
    marginBottom: 25,
    minHeight: 120,
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  boxTitle: {
    color: "#4CC9F0",
    fontSize: 10,
    fontWeight: "bold",
    opacity: 0.7,
  },
  dayText: { color: "#BBB", lineHeight: 22, fontSize: 15 },
  photoSection: { marginBottom: 20 },
  cameraBtn: { backgroundColor: "#4CC9F0", padding: 6, borderRadius: 8 },
  photoWrapper: { marginRight: 12 },
  dailyImg: { width: 100, height: 100, borderRadius: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#11141D",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  modalContentLarge: {
    backgroundColor: "#11141D",
    borderRadius: 30,
    padding: 25,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  input: {
    color: "#FFF",
    fontSize: 16,
    backgroundColor: "#05070A",
    borderRadius: 15,
    padding: 15,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  saveBtn: {
    backgroundColor: "#4CC9F0",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  saveBtnText: { fontWeight: "bold", color: "#000" },
  fullNoteText: { color: "#FFF", fontSize: 16, lineHeight: 26 },
  editNoteFloatingBtn: {
    backgroundColor: "#4CC9F0",
    flexDirection: "row",
    padding: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
  },
});
