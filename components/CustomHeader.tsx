import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function CustomHeader({
  onOpenProfile,
}: {
  onOpenProfile: () => void;
}) {
  return (
    <TouchableOpacity onPress={onOpenProfile} style={styles.headerBtn}>
      <MaterialCommunityIcons name="account-circle" size={32} color="#4CC9F0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({ headerBtn: { marginRight: 15 } });
