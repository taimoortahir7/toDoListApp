export const CREATE_TASK = "CREATE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const SET_TASKS = "SET_TASKS";
import Task from "../../models/task";

export const fetchTasks = (userID, projectID) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://todolistrnproject-288120.firebaseio.com/users/${userID}/projects/${projectID}/tasks.json`
    );

    const resData = await response.json();
    console.log("resData: ", resData);
    const loadedTasks = [];

    for (const key in resData) {
      loadedTasks.push(
        new Task(
          key,
          resData[key].title,
          resData[key].category,
          resData[key].date,
          resData[key].projectName,
          resData[key].projectID,
        )
      );
    }
    console.log("loaded tasks: ", loadedTasks);
    dispatch({ type: SET_TASKS, tasks: loadedTasks });
  };
};

export const createTask = (title, category, date, projectName, userID, projectID) => {
  console.log('projectID: ', projectID);
  console.log('projectName: ', projectName);

  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://todolistrnproject-288120.firebaseio.com/users/${userID}/projects/${projectID}/tasks.json?auth=${token}`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          date,
          projectName,
          projectID
        }),
      }
    );
    const resData = await response.json();
    console.log(resData);
    dispatch({
      type: CREATE_TASK,
      taskData: {
        id: resData.name,
        title,
        category,
        date,
        projectName,
        projectID
      },
    });
  };
};

export const updateTask = (id, title, category, date, projectName, projectID) => {
  return {
    type: UPDATE_TASK,
    pid: id,
    productData: {
      title,
      category,
      date,
      projectName,
      projectID
    },
  };
};
