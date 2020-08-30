import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "../tasks-page/task-item/task-item";

import * as tasksActions from "../../store/actions/tasks";
import {buttonColor, linkColor} from '../../assets/colors';

const Tasks = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(tasksActions.fetchTasks()).then(() => {
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

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return <TaskItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
          location={itemData.item.locationAddress}
        />
      }}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Tasks;
