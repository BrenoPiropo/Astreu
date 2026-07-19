import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingHeader({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity onPress={onOpenMenu} style={styles.button}>
        <MaterialCommunityIcons
          name="account-circle"
          size={40}
          color="#4CC9F0"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Faz ele flutuar sobre o conteúdo
    top: 0,
    left: 20,
    zIndex: 10, // Garante que ele fique acima de tudo
  },
  button: {
    padding: 5,
  },
});
