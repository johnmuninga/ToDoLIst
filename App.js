import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TaskScreen from "./components/TaskScreen";

export default function App() {
  return <TaskScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
