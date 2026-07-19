import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Para fazer o logout
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Definimos a interface das props
interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string; // Nova prop
}

export default function ProfileModal({
  visible,
  onClose,
  userName,
}: ProfileModalProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@astreuhub_user");
    onClose();
    router.replace("/LoginScreen"); // Redireciona para o Login
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account" size={50} color="#05070A" />
          </View>

          {/* Nome vindo das props */}
          <Text style={styles.name}>{userName}</Text>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="cog" size={22} color="#FFF" />
            <Text style={styles.menuText}>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="account" size={22} color="#FFF" />
            <Text style={styles.menuText}>perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 20 }]}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#FF6B6B" />
            <Text style={[styles.menuText, { color: "#FF6B6B" }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1A1E2E",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  avatarContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#4CC9F0",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  name: { color: "#FFF", fontSize: 22, fontWeight: "bold", marginBottom: 30 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
  },
  menuText: { color: "#FFF", fontSize: 16, marginLeft: 15 },
});
