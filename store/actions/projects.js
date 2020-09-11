export const CREATE_PROJECT = "CREATE_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const SET_PROJECTS = "SET_PROJECTS";
import Project from "../../models/project";

export const fetchProjects = (userID) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://todolistrnproject.firebaseio.com/users/${userID}/projects.json`
    );

    const resData = await response.json();
    console.log("resData: ", resData);
    const loadedProjects = [];

    for (const key in resData) {
      loadedProjects.push(
        new Project(
          key,
          resData[key].title,
          resData[key].category,
          resData[key]?.tasks?.length || 0,
        )
      );
    }
    console.log("loaded projects: ", loadedProjects);
    dispatch({ type: SET_PROJECTS, projects: loadedProjects });
  };
};

export const createProject = (title, category, userID) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://todolistrnproject.firebaseio.com/users/${userID}/projects.json?auth=${token}`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
        }),
      }
    );
    const resData = await response.json();
    console.log(resData);
    dispatch({
      type: CREATE_PROJECT,
      projectsData: {
        id: resData.name,
        title,
        category,
      },
    });
  };
};

export const updateProject = (id, title, category) => {
  return {
    type: UPDATE_PROJECT,
    pid: id,
    projectsData: {
      title,
      category,
    },
  };
};
