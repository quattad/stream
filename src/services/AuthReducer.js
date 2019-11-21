import {createContext, useContext} from 'react';

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

  // Set initial state for reducer
  export const authInitialState = {
    isAuthenticated: localStorage.getItem("authState") ? (true) : (false)
  }