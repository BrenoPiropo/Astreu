import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
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
      {/* 1. Foto do Dia */}
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

      {/* 3. Wiki - USANDO METEOR PARA REPRESENTAR ASTEROIDE */}
      <Tabs.Screen
        name="exoplanet" // Deve ser igual ao nome do arquivo
        options={{
          title: "exoplanetas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="earth" size={size} color={color} />
          ),
        }}
      />
      {/* 3. Wiki - USANDO METEOR PARA REPRESENTAR ASTEROIDE */}
      <Tabs.Screen
        name="hubble" // Deve ser igual ao nome do arquivo
        options={{
          title: "Hubble",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="grid" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Insights */}
      <Tabs.Screen
        name="stars"
        options={{
          title: "stars",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="star-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
