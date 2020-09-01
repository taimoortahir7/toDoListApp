import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Projects from './../projects-page/projects-page';
import Settings from './../settings/settings';
// import Profile from './profileComponent';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { buttonColor } from './../../assets/colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='ToDoList' backBehavior='initialRoute' tabBarOptions={{
            activeTintColor: buttonColor,
            showLabel: true
        }}>
            <Tab.Screen name="Projects" component={Projects} initialParams={ {screenName: 'Projects'} } options={{
                tabBarLabel: 'Projects',
                tabBarIcon: ({ color, size }) => (
                    <Image source={require('./../../assets/projectTab.png')}/>
                ),
            }} />
            <Tab.Screen name="Settings" component={Settings} initialParams={ {screenName: 'Settings'} } options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color, size }) => (
                    <Image source={require('./../../assets/settings.png')}/>
                ),
            }}/>
        </Tab.Navigator>
    );
};

export default TabNavigator;