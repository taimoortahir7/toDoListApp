export const CREATE_TASK = "CREATE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const SET_TASKS = "SET_TASKS";
import Task from "../../models/task";

export const fetchTasks = () => {
  return async (dispatch) => {
    const response = await fetch(
      "https://perfumesrnproject.firebaseio.com/products.json"
    );

    const resData = await response.json();
    console.log("resData: ", resData);
    const loadedProducts = [];

    for (const key in resData) {
      loadedProducts.push(
        new Task(
          key,
          resData[key].title,
          resData[key].category,
        )
      );
    }
    console.log("loaded products: ", loadedProducts);
    dispatch({ type: SET_TASKS, products: loadedProducts });
  };
};

export const createTask = (title, category, subTasks) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://perfumesrnproject.firebaseio.com/products.json?auth=${token}`,
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
      type: CREATE_TASK,
      productData: {
        id: resData.name,
        title,
        category,
      },
    });
  };
};

export const updateTask = (id, title, category) => {
  return {
    type: UPDATE_TASK,
    pid: id,
    productData: {
      title,
      category,
    },
  };
};
