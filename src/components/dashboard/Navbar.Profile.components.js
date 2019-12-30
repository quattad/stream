import React from 'react'
import { Redirect } from 'react-router'
import axios from "axios";

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from 'reactstrap';

// Import authContext to check for authentication state; navbarContext to fetch username to render
import { useAuthContext } from '../../services/AuthReducer'
import { useNavbarContext } from "../Navbar.components"

const NavbarProfile = () => {
    const auth = useAuthContext();
    const navbarContext = useNavbarContext();

    // FUNCTIONAL HOOKS
    const [dropDownState, setDropDownState] = React.useState(false)
    const onFireDropDown = () => {setDropDownState(!dropDownState)}

    // REDIRECT HOOKS
    const [fireRedirectProfile, setFireRedirectProfile] = React.useState(false)
    const onFireRedirectProfile = () => setFireRedirectProfile(true)
    const [fireRedirectHome, setFireRedirectHome] = React.useState(false)
    const onFireRedirectHome = () => {setFireRedirectHome(true)}

    // Define logout function
    const onSubmitLogout = async (e) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/users/logout`, {}, {withCredentials: true});
            if (!res.data.error) {
                auth.handleLogout();
                onFireRedirectHome(e)
            }
        } catch (err) {
            throw new Error(err)
        }
    };

    return (
        <>
        {fireRedirectProfile && <Redirect to="/profile"> push={true} </Redirect>}
        {fireRedirectHome && <Redirect to="/"> push={true} </Redirect>}
        <NavLink>
            <Dropdown hidden={!auth.state.isAuthenticated} isOpen={dropDownState} toggle={onFireDropDown}>
                <DropdownToggle outline className="btn-dropdown btn-round" caret>
                    <p>{navbarContext.userState.username}</p>
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