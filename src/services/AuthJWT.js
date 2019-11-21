// NOT IN USE

import axios from 'axios';

// Login
export const login = async (user) => {
    try {
        const res = await axios.get('http://localhost:5000/users/login', {
            // Enable passing of cookies
            withCredentials: true,
            user
        });
        console.log(res)
        
        if (res.status === 200) {}
    }
    catch (err) {}
}

// Logout
export const logout = async () => {
    try {
        const res = await axios.get("http://localhost:5000/users/logout",
        {
            withCredentials:true
        });

        if (res.status === 200) {
        }
    }
    catch (err) {}
}
