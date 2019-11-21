// Handles any route that requires authentication

import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuthContext} from '../services/AuthReducer'

const PrivateRoute = ({
    component: Component, ...rest
}) => {
    const auth = useAuthContext(); // pull object that is passed from Provider to Consumer
    return(
        <Route 
        {...rest} 
        render = {
            (props) => 
            auth.state.isAuthenticated ? (<Component {...props}/>) : (<Redirect to="/login" />)
        } />
    )
}

export default PrivateRoute;