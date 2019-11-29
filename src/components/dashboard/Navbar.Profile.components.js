import React from 'react'
import {useState} from 'react'

import {Redirect} from 'react-router'

import axios from "axios";

// Import required reactstrap components
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Collapse, NavLink } from 'reactstrap';

// import useAuth functions to set authState
import {useAuthContext} from '../../services/AuthReducer'

function NavbarProfile () {
    // Import auth for authentication
    const auth = useAuthContext(); 

    // Define functions, hooks
    const [dropDownState, setDropDownState] = React.useState(false)
    const onFireDropDown = () => {setDropDownState(!dropDownState)}
    
    const [fireRedirectProfile, setFireRedirectProfile] = React.useState(false)
    const onFireRedirectProfile = () => setFireRedirectProfile(true)

    // Set redirect state if user logs out
    const [fireRedirectHome, setFireRedirectHome] = React.useState(false)
    const onFireRedirectHome = (e) => {
        setFireRedirectHome(true)
      }

    // Define logout function
    const onSubmitLogout = (e) => {
        axios.post('http://localhost:5000/users/logout', {}, {withCredentials: true})
            .then((res) => {
                if (!res.data.error) {
                    auth.handleLogout()
                    onFireRedirectHome(e)
                }
            })
            .catch(err => {throw new Error(err)})
        }

    return (
        <>
        {fireRedirectProfile && <Redirect to="/profile"> push={true} </Redirect>}
        {fireRedirectHome && <Redirect to="/"> push={true} </Redirect>}
        <NavLink>
        <Dropdown hidden={!auth.state.isAuthenticated} isOpen={dropDownState} toggle={onFireDropDown}>
            <DropdownToggle 
            outline 
            className="btn-dropdown btn-round" 
            caret
            >
                <p>Jonathan Quah</p>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><div onClick = {() => {onFireRedirectProfile()}}>View Profile</div></DropdownItem>
                <DropdownItem><div onClick = {() => {onSubmitLogout()}}>Logout</div></DropdownItem>
            </DropdownMenu>
        </Dropdown>
        </NavLink>
        </>
    )
};

export default NavbarProfile;