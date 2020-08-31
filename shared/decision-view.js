import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Link } from '@react-navigation/native';

const DecisionView = (props) => {
    return(
        <View style={styles.mainView}>
            <View style={styles.decisionView}>
                <Text style={[ styles.leftLink, styles.textFont ]} onPress={props.cancelFunc}>{props.leftLink}</Text>
                <Text style={styles.textFont}>{props?.title}</Text>
                <Text style={[ styles.rightLink, styles.textFont ]} onPress={props.doneFunc}>{props.rightLink}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    decisionView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'cyan',
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        width: 417,
        marginTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 15
    },
    textFont: {
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 22
    },
    rightLink: {
        color: '#3F72AF'
    },
    leftLink: {
        color: '#898989'
    }
});

export default DecisionView;