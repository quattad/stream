// Handles any route that requires authentication

import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuth} from '../services/Auth'

const PrivateRoute = ({
    component: Component, ...rest
}) => {
    const isAuthenticated = useAuth(); // pull value that is stored in AuthContext state in services/Auth.js

    return(
        <Route 
        {...rest} 
        render = {
            (props) => 
            isAuthenticated ? (<Component {...props}/>) : (<Redirect to="/login" />)
        } />
    )
}

export default PrivateRoute;