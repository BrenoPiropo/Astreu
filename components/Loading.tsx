import { ActivityIndicator, StyleSheet, View } from "react-native";

export const Loading = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color="#4CC9F0" />
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0D17",
  },
});
