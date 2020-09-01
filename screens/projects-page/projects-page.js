import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProjectItem from "../projects-page/project-item/project-item";
import AddView from './../../shared/add-view';

import * as projectsActions from "../../store/actions/projects";
import * as tasksActions from "../../store/actions/tasks";
import {buttonColor, linkColor} from '../../assets/colors';

const Projects = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const projects = useSelector((state) => state.projects.availableProjects);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(projectsActions.fetchProjects()).then(() => {
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
    dispatch(projectsActions.fetchProjects()).then(() => {
      setIsLoading(false);
    });
  };
  
  const addTask = (projectID) => {
    setIsLoading(true);
    dispatch(tasksActions.fetchTasks(projectID)).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <SafeAreaView style={ [styles.safeArea] }>
      <AddView type='project' doneFunc={addProject}/>
      <View>
        <Text style={styles.heading}>Projects</Text>
        <View style={styles.search}>
          <Image source={require('./../../assets/search.png')}/>
          <TextInput
              style={ styles.textInput }
              onChangeText={text => fieldValueChangeFunc(text, passwordTextInput, 'password')}
              placeholder='Search'
              textContentType='name'
              secureTextEntry={true}
              ref={r=>passwordTextInput=r}
          />
        </View>
      </View>
      <Text style={styles.listProjectsNo}>List of Projects ({projects.length})</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => {
          console.log('itemData: ', itemData);
          return <TouchableOpacity onPress={() => navigation.navigate('Tasks', {
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

export default Projects;
