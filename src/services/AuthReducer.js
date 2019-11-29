import {createContext, useContext} from 'react';
import axios from 'axios'

// Creates AuthContext object that has 2 components - Provider and Consumer
// Use for parent class App.js
export const AuthContext = createContext();

// Allows component to use AuthContext object
// Returns props passed down from parent component
export function useAuthContext() {
    return useContext(AuthContext)
}

// Test reducer
export const authReducer = (state, action) => {
    switch (action.type) {
      case 'login':
        localStorage.setItem("authState", true)
        return {
          ...state,
          isAuthenticated: true
        };
      case 'logout':
        localStorage.clear()
        return {
          ...state,
          isAuthenticated: false
        };
      default:
        return state
    }
  };

export const authInitialState = {
  /**
   * Defines initial state for isAuthenticated context that will be used for all child components of 
   * App.js
   */
  isAuthenticated: localStorage.getItem("authState") ? (true) : (false)
}

// Define function to check if current user is authenticated
export const checkAuth = async (auth) => {
  /**
   * Takes in a context object created from using useAuthContext hook in function
   * Sends a GET request to server with cookie and verifies that token is correct
   * Sets localStorage authState to false if user does not possess token or if any error is thrown
   * during request 
   */
  try {
    const res = await axios.get('http://localhost:5000/users/checkauth', {
      withCredentials:true
    });

    if (res.data.error) {
      throw new Error(res.data.error)
    }
  } catch (err) {
    console.log(err)
    auth.handleLogout()
  }
}

export const fetchUserProfile = async (auth) => {
  try {
    const res = await axios.get("http://localhost:5000/users/profile", 
    {
      withCredentials: true
    })
    
    if (!res.data.error) {
      return res.data
    }
  } catch (err) {
    console.log(err)
    auth.handleLogout()   
  }
}