import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {buttonColor, linkColor} from '../../assets/colors';
import logoImage from './../../assets/Time-management-pana1.png';

const OnBoarding = ({ navigation }) => {

    const [loadingText, setLoadingText] = useState(false);
    

    const navigateToSignup = () => {
        navigation.navigate('Signup');
    };

  return (
    <View style={ styles.mainContainer }>
        <Image source={logoImage} style={styles.logoImage}/>

        <View>
            <Text style={ styles.welcomeHeading }>Welcome to Todolist</Text>
            <Text style={ styles.welcomeText }>Free up your mind load by managing your tasks at todolist.</Text>
        </View>

        <TouchableOpacity style={ styles.placeholderButton } onPress={navigateToSignup}>
            <Text style={ styles.buttonText }>Start</Text>
        </TouchableOpacity>
        
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    logoImage: {
        width: 272,
        height: 182
    },
    placeholderButton: {
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: buttonColor,
        padding: 10,
        width: 325,
        height: 50,
        borderRadius: 5,
        marginTop: 140
    },
    buttonText: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: 22
    },
    welcomeHeading: {
        marginVertical: 15,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 28,
        lineHeight: 34,
        color: '#151522',
    },
    welcomeText: {
        marginVertical: 15,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 17,
        lineHeight: 22,
        width: 325,
        color: '#999999'
    }
});

export default OnBoarding;