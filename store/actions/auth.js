import { database } from './../../utils/firebase-config';
import { auth } from './../../utils/firebase-config';

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

export const API_KEY = 'AIzaSyBHAkanBGLEsh_CedWFUfY95zmc8b9wtXQ';
// export const CLIENT_ID = '1026632069497-0ql7nisqutd0f7c1b4kprec03gknf6l8.apps.googleusercontent.com';

export const signup = (name, email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            returnSecureToken: true,
        }),
      }
      
    );

    if (!response.ok) {
      const errData = await response.json();
      if (errData?.error?.message === 'EMAIL_EXISTS') {
        throw new Error("Email already exists!");
      } else if (errData?.error?.message === 'OPERATION_NOT_ALLOWED') {
        throw new Error("Password sign in is disabled!");
      } else if (errData?.error?.message === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        throw new Error("Too many failed attempts! Try again later");
      } else if (errData?.error?.message === 'WEAK_PASSWORD') {
        throw new Error("Password should be at least 6 characters");
      }
    } else {
        const resData = await response.json();
        if (resData) {
          database.ref('users/' + resData.localId).set({
            username: name,
            email: email,
            password : password
          }).then((res) => console.log('res: : ! ! ', res));
        }
        console.log('resDataaaa!!!: ', resData);
        dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      if (errData?.error?.message === 'INVALID_PASSWORD') {
        throw new Error("Invalid Password!");
      } else if (errData?.error?.message === 'EMAIL_NOT_FOUND') {
        throw new Error("Invalid Email or User doesnot exsist!");
      } else if (errData?.error?.message === 'USER_DISABLED') {
        throw new Error("Account has been deactivated!");
      } else if (errData?.error?.message === 'PASSWORD_LOGIN_DISABLED') {
        throw new Error("No user found! Signup first");
      }
    }

    const resData = await response.json();
    console.log('resData: ', resData);
    var user = auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log('signed in: ', user);
      } else {
        console.log('not signed in: ', user);
        // No user is signed in.
      }
    });
    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
  };
};

export const resetPassword = (email) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      if (errData?.error?.message === 'EMAIL_NOT_FOUND') {
        throw new Error("Invalid Email or User doesnot exsist!");
      }
    }

    const resData = await response.json();
    console.log('resData: ', resData);
    // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
  };
}