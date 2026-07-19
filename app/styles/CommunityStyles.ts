import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 15; // Ajuste para o grid da galeria

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  // --- HEADER ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  // --- TABS ---
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 20,
  },
  tabItem: {
    paddingBottom: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CC9F0",
  },
  tabText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 12,
  },
  tabTextActive: {
    color: "#4CC9F0",
  },

  // --- CARDS DE ESTUDOS (POSTS) ---
  postCard: {
    backgroundColor: "#11141D",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4CC9F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  authorName: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  postImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#05070A",
  },
  postInfo: {
    padding: 15,
  },
  postTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postSnippet: {
    color: "#BBB",
    fontSize: 14,
    lineHeight: 20,
  },
  pdfBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 77, 77, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  pdfBadgeText: {
    color: "#FF4D4D",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },
  // Adicione estas propriedades dentro do styles no arquivo CommunityStyles.ts

  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#4CC9F0",
    padding: 3,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  // --- CARDS DA GALERIA ---
  galleryCard: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.2,
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#11141D",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  // --- MENU LATERAL (DRAWER) ---
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "row",
  },
  drawerContent: {
    width: 280,
    backgroundColor: "#0B0D17",
    height: "100%",
    padding: 25,
    borderRightWidth: 1,
    borderRightColor: "#1A1E2E",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  userNameText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  userButtonMenu: {
    backgroundColor: "#4CC9F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    gap: 8,
    width: "100%",
  },
  userButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  drawerDivider: {
    height: 1,
    backgroundColor: "#1A1E2E",
    marginVertical: 25,
  },
  drawerSectionLabel: {
    color: "#444",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
  },
  drawerItemText: {
    color: "#DDD",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: "auto",
    marginBottom: 30,
  },
  logoutText: {
    color: "#FF4D4D",
    fontSize: 15,
    fontWeight: "bold",
  },
});
