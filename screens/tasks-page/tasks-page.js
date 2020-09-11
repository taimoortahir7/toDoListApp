import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "../tasks-page/task-item/task-item";
import Swipeout from 'react-native-swipeout';
import { database } from './../../utils/firebase-config';
import * as tasksActions from "../../store/actions/tasks";
import {buttonColor, linkColor} from '../../assets/colors';
import RBSheet from "react-native-raw-bottom-sheet";
import AddTask from './../tasks-page/add-task/add-task';

const Tasks = ({ route, navigation }) => {

  const { projectID } = route.params;
  const { projectName } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [editValue, setEditValue] = useState();
  const [projectTaskVal, setProjectTaskVal] = useState();
  const refRBSheet = useRef();

  const cancelFunc = () => {
    refRBSheet.current.close();
  };

  const userID = useSelector((state) => state.auth.userId);
  const tasks = useSelector((state) => state.tasks.availableTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(tasksActions.fetchTasks(userID, projectID)).then(() => {
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

  const deleteTask = (userID, projectID, taskID) => {
    setIsLoading(true);
    database.ref('users/' + userID + '/projects/' + projectID + '/tasks/' + taskID).remove().then((res) => console.log('res: ', res));
    dispatch(tasksActions.fetchTasks(userID, projectID)).then(() => {
      setIsLoading(false);
    });
  };
  
  const editTask = (userID, projectID, taskID) => {
    database.ref('users/' + userID + '/projects/' + projectID + '/tasks/' + taskID)
    .once('value')
    .then(function(snapshot) {
      console.log('user: !! ', snapshot.val());
      setEditValue(snapshot.val());
      setProjectTaskVal(taskID);
      refRBSheet.current.open();
    });
  };

  const confirmDoneEditTask = () => {
    setIsLoading(true);
    dispatch(tasksActions.fetchTasks(userID, projectID)).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <SafeAreaView style={ [styles.safeArea] }>
      <Text style={styles.listProjectsNo}>List of Tasks ({tasks.length})</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => {
          return (
            <Swipeout right={[
              {
                text: 'Edit',
                backgroundColor: "#3F72AF",
                onPress: () => {editTask(userID, projectID, itemData.item.id)}
              },
              {
                text: 'Delete',
                backgroundColor: "#ff5447",
                type: 'delete',
                onPress: () => {deleteTask(userID, projectID, itemData.item.id)}
              }
            ]}>
              <TaskItem
                title={itemData.item.title}
                category={itemData.item.category}
                projectName={itemData.item.projectName}
                date={itemData.item.date}
              />
            </Swipeout>
          )
        }}
      />
      <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          height={400}
          openDuration={250}
          // animationType='fade'
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10
            }
          }}
        >
          {
            (editValue) && (
              <AddTask cancelFunc={cancelFunc} type="editTask" taskIDVal={projectTaskVal} projectIDVal={projectID} editValue={editValue} confirmDoneEditTask={confirmDoneEditTask}/>
            )
          }
        </RBSheet>
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
