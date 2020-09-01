// import PRODUCTS from "../../data/dummy-data";
import {
    CREATE_TASK,
    UPDATE_TASK,
    SET_TASKS,
  } from "../actions/tasks";
  import Task from "../../models/task";
  
  const initialState = {
    availableTasks: [],
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_TASKS:
        return {
          availableTasks: action.tasks,
        };
      case CREATE_TASK:
        const newTask = new Task(
          action.taskData.id,
          action.taskData.title,
          action.taskData.category,
          action.taskData.date,
          action.taskData.projectName,
          action.taskData.projectID
        );
        return {
          ...state,
          availableTasks: state.availableTasks.concat(newTask),
        };
      case UPDATE_TASK:
        const taskIndex = state.userTasks.findIndex(
          (task) => task.id === action.pid
        );
        const updatedTask = new Task(
          action.pid,
          action.taskData.title,
          action.taskData.category,
          action.taskData.date,
          action.taskData.projectName,
          action.taskData.projectID
        );
        const updatedUserTasks = [...state.userTasks];
        updatedUserTasks[taskIndex] = updatedTask;
        const availableTaskIndex = state.availableTasks.findIndex(
          (task) => task.id === action.pid
        );
        const updatedAvailableTasks = [...state.availableTasks];
        updatedAvailableTasks[availableTaskIndex] = updatedTask;
        return {
          ...state,
          availableTasks: updatedAvailableTasks,
        };
    }
    return state;
  };
  