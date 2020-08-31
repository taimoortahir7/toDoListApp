import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { Link } from '@react-navigation/native';
import DecisionView from './../../../shared/decision-view';

const AddProject = () => {
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
    }
});

export default AddProject;