import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { Link } from '@react-navigation/native';
import { redColor, orangeColor, blueColor, greenColor } from './../../../assets/colors';
import {Picker} from '@react-native-community/picker';
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from 'react-native-datepicker';
import DecisionView from './../../../shared/decision-view';
import * as tasksActions from "../../../store/actions/tasks";
import { useSelector, useDispatch } from "react-redux";
import { database } from './../../../utils/firebase-config';

const AddTask = (props) => {
    const [priority, setPriority] = useState('preferred');
    const [taskTextInput, setTaskTextInput] = useState('');
    const [date, setDate] = useState("2020-09-15");
    const refRBSheet = useRef();
    const datePickerRef = useRef(null);

    const userID = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();

    const submitHandler = useCallback(() => {
        dispatch(
            tasksActions.createTask(taskTextInput, priority, date, props.projectName, userID, props.projectID)
        );
        // props.doneFunc();
    }, [dispatch, taskTextInput, priority, props.projectName, props.projectID]);

    const doneEditTask = () => {
        database.ref('users/' + userID + '/projects/' + props?.projectIDVal + '/tasks/' + props?.taskIDVal)
        .set({
            title: taskTextInput,
            category: priority,
            date: date,
            projectID: props?.projectIDVal,
            projectName: props?.editValue?.projectName
        }, function(err) {
            if (err) {
                console.log('data not saved!');
            } else {
                console.log('data saved successfully!');
                props.confirmDoneEditTask();
            }
        })
    };

    useEffect(() => {
        if (props?.editValue) {
            setTaskTextInput(props?.editValue?.title);
            setPriority(props?.editValue?.category);
            setDate(props?.editValue?.date);
        }
    }, []);

    return(
        <View style={styles.mainView}>
            {
                (props.type === 'editTask') ? (
                    <DecisionView 
                        leftLink='Cancel' 
                        title='Edit Task' 
                        rightLink='Done' 
                        cancelFunc={props.cancelFunc} 
                        doneFunc={doneEditTask}
                    />
                ) : (
                    <DecisionView 
                        leftLink='Cancel' 
                        title='Add Task' 
                        rightLink='Done' 
                        cancelFunc={props.cancelFunc} 
                        doneFunc={submitHandler}
                    />
                )
            }
            <View style={styles.addProject}>
                <TextInput
                    style={ styles.textInput }
                    onChangeText={text => setTaskTextInput(text)}
                    placeholder='Task Name'
                    textContentType='name'
                    value={taskTextInput}
                />
                <View style={styles.colorDiv}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('./../../../assets/flag.png')}/>
                        <Text style={{ paddingLeft: 10 }}>Flag</Text>
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
                <View style={styles.dateView}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('./../../../assets/dateCalander.png')}/>
                        <Text style={{ marginLeft: 10 }}>Date</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <DatePicker
                        style={{width: 100}}
                        ref={datePickerRef}
                        date={date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="2020-09-01"
                        maxDate="2021-12-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 7
                            },
                            dateInput: {
                                borderWidth: 0,
                                // marginLeft: 280
                            }
                            // ... You can check the source to find the other keys.
                        }}
                            onDateChange={(date) => setDate(date)}
                        />
                        <Image source={require('./../../../assets/rightArrow.png')}/>
                    </View>
                </View>
                <View style={styles.dateView}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('./../../../assets/List.png')}/>
                        <Text style={{ marginLeft: 10 }}>Project</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {
                            (props?.type === 'editTask') && (
                                <Text style={{ marginRight: 10 }}>{props?.editValue?.projectName}</Text>
                            )
                        }
                        {
                            (props?.type !== 'editTask') && (
                                <Text style={{ marginRight: 10 }}>{props.projectName}</Text>
                            )
                        }
                        <Image source={require('./../../../assets/rightArrow.png')}/>
                    </View>
                </View>
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
    },
    dateView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#f0f0f0',
        borderBottomWidth: 1,
        paddingVertical: 10,
        width: 417,
        paddingHorizontal: 15,
    }
});

export default AddTask;