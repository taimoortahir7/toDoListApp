import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "../tasks-page/task-item/task-item";

import * as tasksActions from "../../store/actions/tasks";
import {buttonColor, linkColor} from '../../assets/colors';

const Tasks = ({ route, navigation }) => {

  console.log('route.params: ', route.params);
  const { projectID } = route.params;
  const { projectName } = route.params;

  console.log('projectID: ', projectID);

  const [isLoading, setIsLoading] = useState(false);

  const refRBSheet = useRef();

  const tasks = useSelector((state) => state.tasks.availableTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(tasksActions.fetchTasks(projectID)).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={buttonColor} />
      </View>
    );
  }

  const addProject = (obj) => {
    setIsLoading(true);
    cancelFunc();
    dispatch(tasksActions.fetchProjects(projectID)).then(() => {
      setIsLoading(false);
    });
  };
  const cancelFunc = () => {
    refRBSheet.current.close();
  };

  return (
    <SafeAreaView style={ [styles.safeArea] }>
      <Text style={styles.listProjectsNo}>List of Tasks ({tasks.length})</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => {
          console.log('itemData: ', itemData);
          return <TaskItem
            title={itemData.item.title}
            category={itemData.item.category}
            tasks={itemData.item.tasks}
          />
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1
  },
  addProject: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 34,
    lineHeight: 41,
    marginLeft: 16
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    height: 36, 
    borderColor: 'rgba(118, 118, 128, 0.12);',
    backgroundColor: 'rgba(118, 118, 128, 0.12);',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingLeft: 10
  },
  textInput: { 
    paddingLeft: 10
  },
  listProjectsNo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22
  }
});

export default Tasks;
