import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState("Visitante");
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem("@astreuhub_user");
        if (data) {
          const user = JSON.parse(data);
          setUserName(user.nome || "Astronauta");
        }
      } catch (e) {
        console.error("Erro ao carregar dados do usuário", e);
      }
    };
    loadUser();
  }, []);

  const navigateTo = (path: any) => {
    setMenuVisible(false);
    router.push(path);
  };
  const handleLogout = async () => {
    try {
      // 1. Remove os dados do usuário do armazenamento local
      await AsyncStorage.removeItem("@astreuhub_user");

      // 2. Fecha o menu lateral
      setMenuVisible(false);

      // 3. Redireciona para a tela de Login (usamos 'replace' para ele não conseguir voltar clicando no botão de voltar do celular)
      router.replace("/LoginScreen");
    } catch (e) {
      console.error("Erro ao fazer logout", e);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#05070A" }}>
      {/* 1. NOSSO HEADER CUSTOMIZADO (Resolve o problema de sobreposição) */}
      <View style={[styles.customHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons
            name="account-circle"
            size={42}
            color="#4CC9F0"
          />
        </TouchableOpacity>
      </View>

      {/* 2. NAVEGAÇÃO (Tabs) */}
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false, // Mantemos desativado para não ter a "faixa preta" nativa
          tabBarActiveTintColor: "#4CC9F0",
          tabBarInactiveTintColor: "#555",
          tabBarStyle: {
            backgroundColor: "#05070A",
            borderTopColor: "#1A1E2E",
            height: 65,
            paddingBottom: 10,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Foto do Dia",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="telescope"
                size={size + 2}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Espaço",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="rocket" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="sky"
          options={{
            title: "O Céu",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="star-four-points"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="hubble"
          options={{
            title: "Hubble",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Astreu AI",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="robot-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        {/* Telas Ocultas */}
        <Tabs.Screen
          name="LoginScreen"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen name="exoplanet" options={{ href: null }} />
        <Tabs.Screen name="stars" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="gallerytab" options={{ href: null }} />
        <Tabs.Screen name="create-post" options={{ href: null }} />
      </Tabs>

      {/* 3. MODAL (Menu Lateral) */}
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
              <Text style={styles.userNameText}>{userName}</Text>

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

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  // NOVO ESTILO DO HEADER
  customHeader: {
    backgroundColor: "#05070A", // Mesma cor de fundo do app
    paddingHorizontal: 20,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  // RESTANTE DOS ESTILOS
  drawerOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  drawerContent: { width: "80%", backgroundColor: "#05070A", padding: 20 },
  drawerCloseArea: { flex: 1 },
  profileSection: { alignItems: "center", marginBottom: 20 },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#4CC9F0",
  },
  profileImage: { width: "100%", height: "100%" },
  welcomeText: { color: "#888", fontSize: 14 },
  userNameText: { color: "#FFF", fontWeight: "bold", fontSize: 20 },
  userButtonMenu: {
    flexDirection: "row",
    backgroundColor: "#4CC9F0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 15,
  },
  userButtonText: { marginLeft: 5, fontWeight: "bold", fontSize: 12 },
  drawerDivider: { height: 1, backgroundColor: "#1A1E2E", marginVertical: 20 },
  drawerSectionLabel: {
    color: "#555",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  drawerItemText: { color: "#FFF", marginLeft: 15, fontSize: 16 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  logoutText: { color: "#FF4D4D", marginLeft: 15, fontSize: 16 },
});
