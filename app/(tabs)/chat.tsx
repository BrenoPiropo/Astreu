import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";

const COLORS = {
  background: "#05070A",
  surface: "#1A1E2E",
  accent: "#4CC9F0",
  textPrimary: "#FFFFFF",
  textSecondary: "#8B95A5",
  drawerBg: "#0F131F",
};

const INITIAL_MESSAGE: IMessage = {
  _id: "1",
  text: "Olá! Sou o Astreu. Como posso te ajudar a explorar o universo hoje?",
  createdAt: new Date(),
  user: { _id: 2, name: "Astreu" },
};

// 💡 SEU IP AQUI!
const BACKEND_URL = "http://10.0.2.2:3000/ai";

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState("default-session");
  const [sessions, setSessions] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadUserAndSessions = async () => {
        try {
          // 💡 LIMPEZA IMEDIATA: Apaga o cache da tela para não vazar dados do usuário anterior
          setSessions([]);
          setMessages([INITIAL_MESSAGE]);

          const data = await AsyncStorage.getItem("@astreuhub_user");
          if (data) {
            const user = JSON.parse(data);
            setUserId(user.id);
            await loadUserSessions(user.id);
          }
        } catch (e) {
          console.error("Erro ao recarregar usuário no foco", e);
        }
      };

      loadUserAndSessions();
    }, []),
  );

  const loadUserSessions = async (currentUserId: number) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/sessions?userId=${currentUserId}`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setSessions(data);
        // 💡 Passa o ID do usuário para o loadHistory
        loadHistory(data[0].id, currentUserId);
      } else {
        setSessions([]);
        setMessages([INITIAL_MESSAGE]);
        handleNewChat();
      }
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    }
  };

  // 💡 Agora o loadHistory também precisa enviar o currentUserId na requisição
  const loadHistory = async (sessionId: string, currentUserId: number) => {
    setCurrentSessionId(sessionId);
    try {
      const response = await fetch(
        `${BACKEND_URL}/history/${sessionId}?userId=${currentUserId}`,
      );
      const history = await response.json();

      if (history && history.length > 0) {
        setMessages(history);
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setMessages([INITIAL_MESSAGE]);
    }
  };

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    setSessions((prev) => [
      { id: newSessionId, title: "Novo Chat", updatedAt: Date.now() },
      ...prev,
    ]);
    setCurrentSessionId(newSessionId);
    setMessages([INITIAL_MESSAGE]);
    setIsDrawerOpen(false);
  };

  const handleSwitchSession = (sessionId: string) => {
    if (userId) {
      loadHistory(sessionId, userId);
    }
    setIsDrawerOpen(false);
  };

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      setMessages((prev) => GiftedChat.append(prev, newMessages));
      setIsTyping(true);

      try {
        const userMessage = newMessages[0].text;

        setSessions((prevSessions) =>
          prevSessions.map((s) =>
            s.id === currentSessionId && s.title === "Novo Chat"
              ? { ...s, title: userMessage.substring(0, 30) + "..." }
              : s,
          ),
        );

        const response = await fetch(`${BACKEND_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: userMessage,
            sessionId: currentSessionId,
            userId: userId,
          }),
        });

        const data = await response.json();

        const botResponse: IMessage = {
          _id: Math.random().toString(),
          text: data.answer || "O Astreu está processando...",
          createdAt: new Date(),
          user: { _id: 2, name: "Astreu" },
        };

        setMessages((prev) => GiftedChat.append(prev, [botResponse]));

        if (userId) {
          loadUserSessions(userId);
        }
      } catch (error) {
        setMessages((prev) =>
          GiftedChat.append(prev, [
            {
              _id: Math.random().toString(),
              text: "Erro de conexão com o Astreu Hub.",
              createdAt: new Date(),
              user: { _id: 2, name: "Astreu" },
            },
          ]),
        );
      } finally {
        setIsTyping(false);
      }
    },
    [currentSessionId, sessions, userId],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsDrawerOpen(true)}
        >
          <MaterialCommunityIcons
            name="menu"
            size={28}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Astreu</Text>
        <View style={{ width: 28 }} />
      </View>

      <GiftedChat
        messages={messages}
        onSend={(msg) => onSend(msg)}
        user={{ _id: 1 }}
        isTyping={isTyping}
        textInputProps={{
          style: styles.textInput,
          placeholder: "Pergunte sobre astronomia...",
          placeholderTextColor: COLORS.textSecondary,
        }}
        renderInputToolbar={(props) => (
          <InputToolbar {...props} containerStyle={styles.inputToolbar} />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: COLORS.accent,
                borderTopRightRadius: 0,
              },
              left: { backgroundColor: COLORS.surface, borderTopLeftRadius: 0 },
            }}
            textStyle={{
              right: { color: "#000", fontSize: 15 },
              left: { color: COLORS.textPrimary, fontSize: 15 },
            }}
          />
        )}
        renderSend={(props) => (
          <Send {...props} containerStyle={styles.sendButton}>
            <MaterialCommunityIcons
              name="send-circle"
              size={38}
              color={COLORS.accent}
            />
          </Send>
        )}
      />

      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}

      <Modal visible={isDrawerOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.drawer}>
            <Text style={styles.drawerTitle}>Histórico</Text>

            <TouchableOpacity
              style={styles.newChatButton}
              onPress={handleNewChat}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#000" />
              <Text style={styles.newChatText}>Novo Chat</Text>
            </TouchableOpacity>

            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sessionItem,
                    currentSessionId === item.id && styles.sessionItemActive,
                  ]}
                  onPress={() => handleSwitchSession(item.id)}
                >
                  <MaterialCommunityIcons
                    name="message-outline"
                    size={20}
                    color={
                      currentSessionId === item.id
                        ? COLORS.accent
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.sessionText,
                      currentSessionId === item.id && styles.sessionTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity
            style={styles.closeArea}
            onPress={() => setIsDrawerOpen(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2F45",
  },
  menuButton: { padding: 5 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: "bold" },
  inputToolbar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    marginHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  textInput: {
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingLeft: 10,
    paddingTop: 8,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  drawer: {
    width: "75%",
    backgroundColor: COLORS.drawerBg,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
  },
  closeArea: { width: "25%", height: "100%" },
  drawerTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    marginTop: 20,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  newChatText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1E2E",
  },
  sessionItemActive: {
    backgroundColor: "rgba(76, 201, 240, 0.1)",
    borderRadius: 8,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  sessionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
  sessionTextActive: { color: COLORS.accent, fontWeight: "bold" },
});
