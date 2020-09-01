import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { redColor, orangeColor, blueColor, greenColor } from '../../../assets/colors';

const TaskItem = (props) => {
  return (
    <View style={styles.orderItem}>
      <View style={styles.category}>
        {
          (props.category === 'highest') && (
            <View style={ [styles.categoryBackground, styles.categoryRed] }>
              <Image source={require('./../../../assets/flag.png')}/>
            </View>
          )
        }
        {
          (props.category === 'preferred') && (
            <View style={ [styles.categoryBackground, styles.categoryOrange] }>
              <Image source={require('./../../../assets/flag.png')}/>
            </View>
          )
        }
        {
          (props.category === 'moderate') && (
            <View style={ [styles.categoryBackground, styles.categoryBlue] }>
              <Image source={require('./../../../assets/flag.png')}/>
            </View>
          )
        }
        {
          (props.category === 'low') && (
            <View style={ [styles.categoryBackground, styles.categoryGreen] }>
              <Image source={require('./../../../assets/flag.png')}/>
            </View>
          )
        }
      </View>
      <View style={styles.title}>
        <Text style={{ paddingHorizontal: 10, paddingVertical: 5 }}>{props.title}</Text>
        <View style={styles.tasks}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('./../../../assets/taskIcon.png')}/>
            <Text style={{ paddingHorizontal: 5}}>{props.projectName}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('./../../../assets/dateImage.png')}/>
            <Text style={{ paddingHorizontal: 5 , marginLeft: 5}}>{props.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
  categoryBackground: {
    alignItems: "center",
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 4,
    shadowColor: "rgba(50, 50, 71, 0.08)",
    shadowOpacity: 5,
    shadowOffset: { width: 4, height: 14 },
    shadowRadius: 8,
    elevation: 5,
    // shadow: '0px 4px 4px rgba(50, 50, 71, 0.08), 0px 4px 8px rgba(50, 50, 71, 0.06)'
  },
  categoryRed: {
    backgroundColor: redColor
  },
  categoryOrange: {
    backgroundColor: orangeColor
  },
  categoryBlue: {
    backgroundColor: blueColor
  },
  categoryGreen: {
    backgroundColor: greenColor
  },
  title: {
    display: 'flex',
    // alignItems: 'center'
  },
  tasks: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 330,
    paddingHorizontal: 8,
    alignItems: 'center'
  }
});

export default TaskItem;
