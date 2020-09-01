import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import AddTask from './../screens/tasks-page/add-task/add-task';
import AddProject from './../screens/projects-page/add-project/add-project';
import RBSheet from "react-native-raw-bottom-sheet";

const AddView = (props) => {
  const refRBSheet = useRef();

  console.log('projectID: ', props.projectID);

  const cancelFunc = () => {
    refRBSheet.current.close();
  };

  return (
    <View style={styles.addProject}>
        <TouchableOpacity activeOpacity = { .5 } onPress={() => refRBSheet.current.open()}>
          <Image source={require('./../assets/plusBlue.png')}/>
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
            {
                (props.type === 'project') && (
                    <AddProject cancelFunc={cancelFunc} doneFunc={props.doneFunc}/>
                )
            }
            {
                (props.type === 'task') && (
                  <AddTask
                    projectName={props.projectName}
                    projectID={props.projectID}
                    cancelFunc={cancelFunc}
                    doneFunc={props.doneFunc}
                  />
                )
            }
        </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  addProject: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 15,
  }
});

export default AddView;
