import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProjectItem from "../projects-page/project-item/project-item";
import AddView from './../../shared/add-view';
import Swipeout from 'react-native-swipeout';
import { database } from './../../utils/firebase-config';
import * as projectsActions from "../../store/actions/projects";
import * as tasksActions from "../../store/actions/tasks";
import {buttonColor, linkColor} from '../../assets/colors';
import RBSheet from "react-native-raw-bottom-sheet";
import AddProject from './../projects-page/add-project/add-project';

const Projects = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editValue, setEditValue] = useState();
  const [projectIDVal, setProjectIDVal] = useState();
  const refRBSheet = useRef();

  const cancelFunc = () => {
    refRBSheet.current.close();
  };

  const userID = useSelector((state) => state.auth.userId);
  let projects = useSelector((state) => state.projects.availableProjects);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(projectsActions.fetchProjects(userID)).then(() => {
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
    dispatch(projectsActions.fetchProjects(userID)).then(() => {
      setIsLoading(false);
    });
  };

  const deleteProject = (userID, projectID) => {
    setIsLoading(true);
    database.ref('users/' + userID + '/projects/' + projectID).remove().then((res) => console.log('res: ', res));
    dispatch(projectsActions.fetchProjects(userID)).then(() => {
      setIsLoading(false);
    });
  };
  
  const editProject = (userID, projectID) => {
    database.ref('users/' + userID + '/projects/' + projectID)
    .once('value')
    .then(function(snapshot) {
      console.log('user: !! ', snapshot.val());
      setProjectIDVal(projectID);
      setEditValue(snapshot.val());
      refRBSheet.current.open();
    });
  };

  const confirmDoneEditProject = () => {
    setIsLoading(true);
    dispatch(projectsActions.fetchProjects(userID)).then(() => {
      setIsLoading(false);
    });
  };
  
  const addTask = (projectID) => {
    setIsLoading(true);
    dispatch(tasksActions.fetchTasks(userID, projectID)).then(() => {
      setIsLoading(false);
    });
  };

  const searchFilterFunction = text => {    
    return projects = projects.filter(item => item.toLowerCase().match(text));
  };

  return (
    <SafeAreaView style={ [styles.safeArea] }>
      <AddView type='project' doneFunc={addProject}/>
      <View>
        <Text style={styles.heading}>Projects</Text>
        {/* <View style={styles.search}>
          <Image source={require('./../../assets/search.png')}/>
          <TextInput
              style={ styles.textInput }
              onChangeText={text => searchFilterFunction(text)}
              placeholder='Search'
              textContentType='name'
              ref={r=>passwordTextInput=r}
          />
        </View> */}
      </View>
      <Text style={styles.listProjectsNo}>List of Projects ({projects.length})</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => {
          console.log('itemData: ', itemData);
          return (
            <Swipeout right={[
              {
                text: 'Edit',
                backgroundColor: "#3F72AF",
                onPress: () => {editProject(userID, itemData.item.id)}
              },
              {
                text: 'Delete',
                backgroundColor: "#ff5447",
                type: 'delete',
                onPress: () => {deleteProject(userID, itemData.item.id)}
              }
            ]}>
              <TouchableOpacity onPress={() => navigation.navigate('Tasks', {
                projectID: itemData.item.id,
                projectName: itemData.item.title,
                addTask: addTask(itemData.item.id)
              })}>
              <ProjectItem
                title={itemData.item.title}
                category={itemData.item.category}
                tasks={itemData.item.tasks}
              />
              </TouchableOpacity>
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
              <AddProject cancelFunc={cancelFunc} type="editProject" projectIDVal={projectIDVal} editValue={editValue} confirmDoneEditProject={confirmDoneEditProject}/>
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

export default Projects;
