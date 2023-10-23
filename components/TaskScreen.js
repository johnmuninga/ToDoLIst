import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Foundation } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");

  useEffect(() => {
    const qry = query(collection(db, "tasks"));

    onSnapshot(qry, (databaseSnapshot) => {
      let temp = [];
      databaseSnapshot.forEach((doc) => {
        console.log([{ id: doc.id, ...doc.data() }]);
        temp.push({ id: doc.id, ...doc.data() });
      });
      setTasks(temp);
    });
  }, []);

  const handleCompleteClick = async (taskId) => {
    try {
      const taskToComplete = tasks.find((task) => task.id === taskId);

      if (taskToComplete) {
        await updateDoc(doc(db, "tasks", taskId), {
          isComplete: true,
        });

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        setCompletedTasks((prevCompletedTasks) => [
          ...prevCompletedTasks,
          taskToComplete,
        ]);
      }
    } catch (error) {
      console.error("Error completing task:", error);
      ToastAndroid.show(
        "Error completing task. Please try again.",
        ToastAndroid.LONG
      );
    }
  };

  const handleDeleteClick = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleAddTask = () => {
    try {
      // Check if taskDescription and taskDate are not empty
      if (!taskDescription.trim() || !taskDate.trim()) {
        ToastAndroid.show(
          "Please enter a task description and date",
          ToastAndroid.LONG
        );
        return;
      }

      const documentRef = doc(collection(db, "tasks"));

      const newTaskData = {
        completeBy: taskDate,
        description: taskDescription,
        isComplete: false,
      };

      setDoc(documentRef, newTaskData)
        .then(() => {
          setTasks([...tasks, { id: documentRef.id, ...newTaskData }]);

          ToastAndroid.show("Added new task successfully", ToastAndroid.LONG);

          setTaskDate("");
          setTaskDescription("");
        })
        .catch((error) => {
          console.error("Error adding new task:", error);
          ToastAndroid.show(
            "Error adding new task. Please try again.",
            ToastAndroid.LONG
          );
        });
    } catch (error) {
      console.error("Error:", error);
      ToastAndroid.show("Error saving the task", ToastAndroid.LONG);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>
        <View style={styles.container}>
          <StatusBar style="auto" />
          {/* Create Task */}
          <View style={{ marginBottom: 30 }}>
            <View>
              <Text style={styles.headerText}>Create a task</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.taskInput}
                placeholder="Task Description"
                value={taskDescription}
                onChangeText={(text) => setTaskDescription(text)}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="2023/09/27"
                keyboardType="numeric"
                value={taskDate}
                onChangeText={(text) => setTaskDate(text)}
              />
            </View>
            <View style={{ marginTop: 30 }}>
              <TouchableOpacity style={styles.btnAdd} onPress={handleAddTask}>
                <Text style={{ textAlign: "center", color: "white" }}>
                  Add Tasks
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Task List */}
          <View>
            <View>
              <Text style={styles.headerText}>Task List</Text>
            </View>
            <Text style={{ color: "lightgray", marginTop: 10 }}>
              _________________________________________________________
            </Text>
            {tasks.map((task) => (
              <View key={task.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20 }}>{task.description}</Text>
                  </View>
                  <View style={styles.btnsContainer}>
                    <View
                      style={{
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        height: 30,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleCompleteClick(task.id)}
                      >
                        <AntDesign name="check" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        height: 30,
                      }}
                      onPress={() => handleDeleteClick(task.id)}
                    >
                      <Foundation name="x" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={{ color: "gray" }}>
                  Complete by: {task.completeBy}
                </Text>
              </View>
            ))}
          </View>

          <Text style={{ color: "lightgray", marginVertical: 20 }}>
            _________________________________________________________
          </Text>
          {/* Complete Task Container */}
          <View>
            <View>
              <Text style={styles.headerText}>Complete Task</Text>
            </View>
            <Text style={{ color: "lightgray", marginVertical: 20 }}>
              _________________________________________________________
            </Text>
            {completedTasks.map((completedTask) => (
              <View key={completedTask.id} style={styles.completedTaskItem}>
                <Text style={{ color: "gray", fontSize: 20, marginBottom: 10 }}>
                  {completedTask.description}
                </Text>
              </View>
            ))}
            <Text style={{ color: "lightgray", marginTop: 20 }}>
              _________________________________________________________
            </Text>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    left: 5,
    width: "96%",
    top: 30,
  },
  createTask: {},
  headerText: {
    fontSize: 24,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: "gray",
    flex: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 30,
  },
  btnAdd: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
  },
  btnsContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
});
