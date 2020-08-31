// import PRODUCTS from "../../data/dummy-data";
import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  SET_PROJECTS,
} from "../actions/projects";
import Project from "../../models/project";

const initialState = {
  availableProjects: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        availableProjects: action.projects,
      };
    case CREATE_PROJECT:
      const newProject = new Project(
        action.id,
        action.title,
        action.category,
      );
      return {
        ...state,
        availableProjects: state.availableProjects.concat(newProject),
      };
    case UPDATE_PROJECT:
      const projectIndex = state.userProjects.findIndex(
        (proj) => proj.id === action.pid
      );
      const updatedProject = new Project(
        action.pid,
        action.projectData.title,
        action.projectData.category,
        action.projectData.tasks,
      );
      const updatedUserProjects = [...state.userProjects];
      updatedUserProjects[projectIndex] = updatedProject;
      const availableProjectIndex = state.availableProjects.findIndex(
        (proj) => proj.id === action.pid
      );
      const updatedAvailableProjects = [...state.availableProjects];
      updatedAvailableProjects[availableProjectIndex] = updatedProject;
      return {
        ...state,
        availableProjects: updatedAvailableProjects,
      };
  }
  return state;
};
