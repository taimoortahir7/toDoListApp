import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProjectItem from "../projects-page/project-item/project-item";
import AddProject from './add-project/add-project';
import RBSheet from "react-native-raw-bottom-sheet";

import * as projectsActions from "../../store/actions/projects";
import {buttonColor, linkColor} from '../../assets/colors';

const Projects = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const refRBSheet = useRef();

  const projects = useSelector((state) => state.projects.projects);
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
    cancelFunc();
    console.log('obj: ', obj);
  };
  const cancelFunc = () => {
    refRBSheet.current.close();
  };

  return (
    <SafeAreaView style={ [styles.safeArea] }>
      <View style={styles.addProject}>
        <TouchableOpacity activeOpacity = { .5 } onPress={() => refRBSheet.current.open()}>
          <Image source={require('./../../assets/plus.png')}/>
        </TouchableOpacity>
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
          <AddProject cancelFunc={cancelFunc} doneFunc={addProject}/>
        </RBSheet>
      </View>
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
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => {
          return <ProjectItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
            location={itemData.item.locationAddress}
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
});

export default Projects;
