import React, {useState} from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { Link } from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';
import RBSheet from "react-native-raw-bottom-sheet";
import DecisionView from './../../../shared/decision-view';

const AddProject = () => {
    const [priority, setPriority] = useState('orange');

    return(
        <View style={styles.mainView}>
            <DecisionView leftLink='Cancel' title='Add Project' rightLink='Done'/>
            <View style={styles.addProject}>
                <TextInput
                    style={ styles.textInput }
                    onChangeText={text => fieldValueChangeFunc(text, emailTextInput, 'email')}
                    placeholder='Project Name'
                    textContentType='name'
                    ref={r=>emailTextInput=r}
                />
                <View style={styles.colorDiv}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('./../../../assets/colors.png')}/>
                        <Text style={{ paddingLeft: 10 }}>Color</Text>
                    </View>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => this.RBSheet.open()}>
                        <View style={{ width: 20, height: 20, backgroundColor: 'red' }}></View>
                        <Image source={require('./../../../assets/rightArrow.png')}/>
                    </TouchableOpacity>
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
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
                            <Text style={styles.doneLink} onPress={() => this.RBSheet.close()}>Done</Text>
                        </View>
                        <Picker
                            selectedValue={priority}
                            style={{height: 200, width: 200}}
                            onValueChange={(itemValue, itemIndex) =>
                                setPriority(itemValue)
                            }>
                                <Picker.Item label="Highest" value="red" />
                                <Picker.Item label="Prefered" value="orange" />
                                <Picker.Item label="Moderate" value="blue" />
                                <Picker.Item label="Low" value="green" />
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
        marginVertical: 10,
        paddingLeft: 20
    },
    addProject: {
        alignItems: 'center'
    },
    colorDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
});

export default AddProject;