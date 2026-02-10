import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="community"
      screenOptions={{
        tabBarActiveTintColor: "#4CC9F0",
        tabBarInactiveTintColor: "#555",
        tabBarStyle: {
          backgroundColor: "#05070A",
          borderTopColor: "#1A1E2E",
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      {/* 1. Community - AGORA ESPAÇO COMPARTILHADO */}
      <Tabs.Screen
        name="community"
        options={{
          // Mudando o nome e adicionando o emoji de foguete no texto
          title: "Espaço Compartilhado 🚀",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="rocket" size={26} color={color} />
          ),
        }}
      />

      {/* 2. O Céu */}
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

      {/* 3. Hubble */}
      <Tabs.Screen
        name="hubble"
        options={{
          title: "Hubble",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="grid" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Foto do Dia */}
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

      {/* --- TELAS OCULTAS --- */}
      <Tabs.Screen name="exoplanet" options={{ href: null }} />
      <Tabs.Screen name="stars" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
