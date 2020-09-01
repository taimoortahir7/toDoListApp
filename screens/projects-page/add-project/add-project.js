import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { Link } from '@react-navigation/native';
import { redColor, orangeColor, blueColor, greenColor } from './../../../assets/colors';
import {Picker} from '@react-native-community/picker';
import RBSheet from "react-native-raw-bottom-sheet";
import DecisionView from './../../../shared/decision-view';
import * as projectsActions from "../../../store/actions/projects";
import { useSelector, useDispatch } from "react-redux";

const AddProject = (props) => {
    const [priority, setPriority] = useState('preferred');
    const [projectTextInput, setProjectTextInput] = useState('');
    const refRBSheet = useRef();

    const dispatch = useDispatch();

    const submitHandler = useCallback(() => {
        dispatch(
            projectsActions.createProject(projectTextInput, priority)
        );
        props.doneFunc();
    }, [dispatch, projectTextInput, priority]);

    // useEffect(() => {
    //     props.navigation.setParams({ submit: submitHandler });
    // }, [submitHandler]);

    return(
        <View style={styles.mainView}>
            <DecisionView 
                leftLink='Cancel' 
                title='Add Project' 
                rightLink='Done' 
                cancelFunc={props.cancelFunc} 
                doneFunc={submitHandler}
            />
            <View style={styles.addProject}>
                <TextInput
                    style={ styles.textInput }
                    onChangeText={text => setProjectTextInput(text)}
                    placeholder='Project Name'
                    textContentType='name'
                />
                <View style={styles.colorDiv}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('./../../../assets/colors.png')}/>
                        <Text style={{ paddingLeft: 10 }}>Color</Text>
                    </View>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => refRBSheet.current.open()}>
                        {
                            ( priority === 'highest' ) && (
                                <View style={ [styles.priorityCircle, styles.redBackground] }></View>
                            )
                        }
                        {
                            ( priority === 'preferred' ) && (
                                <View style={ [styles.priorityCircle, styles.orangeBackground] }></View>
                            )
                        }
                        {
                            ( priority === 'moderate' ) && (
                                <View style={ [styles.priorityCircle, styles.blueBackground] }></View>
                            )
                        }
                        {
                            ( priority === 'low' ) && (
                                <View style={ [styles.priorityCircle, styles.greenBackground] }></View>
                            )
                        }
                        <Image source={require('./../../../assets/rightArrow.png')}/>
                    </TouchableOpacity>
                </View>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    height={250}
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
                        <View style={{alignItems: 'flex-end', paddingHorizontal: 15, width: '100%' }}>
                            <Text style={styles.doneLink} onPress={() => refRBSheet.current.close()}>Done</Text>
                        </View>
                        <Picker
                            selectedValue={priority}
                            style={{height: 200, width: 200}}
                            onValueChange={(itemValue, itemIndex) =>
                                setPriority(itemValue)
                            }>
                                <Picker.Item label="Highest" value="highest" />
                                <Picker.Item label="Prefered" value="preferred" />
                                <Picker.Item label="Moderate" value="moderate" />
                                <Picker.Item label="Low" value="low" />
                        </Picker>
                </RBSheet>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    textInput: { 
        height: 50, 
        borderColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderRadius: 5,
        width: 417,
        // marginVertical: 10,
        paddingLeft: 20
    },
    addProject: {
        alignItems: 'center'
    },
    colorDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#f0f0f0',
        borderBottomWidth: 1,
        paddingVertical: 10,
        width: 417,
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    doneLink: {
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 22,
        color: '#3F72AF'
    },
    priorityCircle: {
        width: 24,
        height: 24,
        marginRight: 5,
        borderRadius: 15
    },
    redBackground: {
        backgroundColor: redColor
    },
    orangeBackground: {
        backgroundColor: orangeColor
    },
    blueBackground: {
        backgroundColor: blueColor
    },
    greenBackground: {
        backgroundColor: greenColor
    }
});

export default AddProject;