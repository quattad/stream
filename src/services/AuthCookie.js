// NOT IN USE

import {createContext, useContext} from 'react';
import axios from 'axios';

// AUTH CONTEXT
export const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext)
}

// Check if IsAuthenticated exists in localStorage
export function checkIsAuthenticated() {
    if (localStorage.getItem("isAuthenticated")) {
        return true
    } else {
        return false
    }
}

  // Login aka createCookie
  export const createCookie = async () => {
    try {
        const res = await axios.get('http://localhost:5000/auth/create-cookie', {
            withCredentials: true,
            auth: {
              username: 'user',
              password: '456'
            }
          });
        
        if (res.status === 200) {
            console.log("Create cookie")
            localStorage.setItem("isAuthenticated", true)
        }
    }
    catch (err) {
        console.log("createCookie error: " + err)
    }
  }

// Check login aka Read cookie
export const readCookie = async () => {
    console.log("Run readCookie...")
    try {
        const res = await axios.get('http://localhost:5000/auth/read-cookie', {
            withCredentials: true
        })

        if (res.data.screen !== undefined && res.data.screen == 'user') {
            console.log("readCookie returning true...")
            return true
        } else {
            console.log("readCookie returning false...")
            return false
        }
    }
    catch (err) {
        console.log("readCookie error: " + err)
    }
}

// Logout aka Delete cookie
export const deleteCookie = async () => {
    try {
        const res = await axios.get("http://localhost:5000/auth/delete-cookie",
        {
            withCredentials:true
        });

        if (res.status === 200) {
            console.log("deleteCookie successful")
            localStorage.removeItem("isAuthenticated")
        }
    }
    catch (err) {
        console.log("deleteCookie error: " + err)
    }
}