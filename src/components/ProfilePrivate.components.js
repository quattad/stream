/*eslint-disable*/
import React from "react";
import { Button, Container, Form, Input, InputGroup, Col} from "reactstrap";

import TransparentFooter from './TransparentFooter'
import axios from "axios";

import {useAuthContext, checkAuth} from "../services/AuthReducer"

function HomePrivate() {
  const auth = useAuthContext();

  const fetchUserProfile = async () => {
    try {
    const res = await axios.get("http://localhost:5000/users/profile", 
    {
      withCredentials: true
    })
    
    if (!res.data.error) {
      setUsernameState(res.data.username)
      setFirstNameState(res.data.firstname)
      setLastNameState(res.data.lastname)
    }
  } catch (err) {
    console.log(err)
    auth.handleLogout()   
  }
}

  // Define states
  const[usernameState, setUsernameState] = React.useState("")
  const[firstNameState, setFirstNameState] = React.useState("")
  const[lastNameState, setLastNameState] = React.useState("")
  const[editProfileState, setEditProfileState] = React.useState("")

  // Define functions to set states of register form variables
  const onChangeUsername = (e) => {setUsernameState(e.target.value)};
  const onChangeFirstName = (e) => {setFirstNameState(e.target.value)};
  const onChangeLastName = (e) => {setLastNameState(e.target.value)};

  // Define state variables for focus feature
  const [usernameFocus, setUsernameFocus] = React.useState(false);
  const [firstNameFocus, setFirstNameFocus] = React.useState(false);
  const [lastNameFocus, setLastNameFocus] = React.useState(false);

  // Define function for form submission to update user profile
  const saveUserProfile = async (e) => {
    e.preventDefault();

    const updateUser = {
      "username": usernameState,
      "firstname": firstNameState,
      "lastname": lastNameState,
    }

    try {
      const res = await axios.post('http://localhost:5000/users/update', 
      updateUser, 
      {
        withCredentials:true
      })
      
      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }; 

  let pageHeader = React.createRef();

  React.useEffect(() => {
    checkAuth(auth)
    // Fetch information from backend API
    fetchUserProfile()
    document.body.classList.add("sidebar-collapse");
    document.body.classList.add("login-page");
    document.documentElement.classList.remove("nav-open")

    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);

    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
      };
    }
  }, []);

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div className="page-header-image" style={{
          backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"}}ref={pageHeader}>
        </div>
        <Container>
        <Form onSubmit = {saveUserProfile} className="form" method="POST">
        <Col className="ml-auto mr-auto" md="4">
          <h5 className="title">Username</h5>
        <h5 className="description" hidden={editProfileState}>{usernameState}</h5>
        <InputGroup 
        hidden={!editProfileState} className={"no-border input-lg" + (usernameFocus ? " input-group-focus" : "")}>
          <Input value={usernameState} type="text" style={{color:"#ffffff"}}
          onChange = {(e) => onChangeUsername(e)}
          onFocus={() => setUsernameFocus(true)} 
          onBlur={() => setUsernameFocus(false)}></Input>
        </InputGroup>
          <h5 className="title">First Name</h5>
        <h5 className="description" hidden={editProfileState}>{firstNameState}</h5>
        <InputGroup 
        hidden={!editProfileState} className={"no-border input-lg" + (firstNameFocus ? " input-group-focus" : "")}>
          <Input value={firstNameState} type="text" style={{color:"#ffffff"}}
          onChange = {(e) => onChangeFirstName(e)}
          onFocus={() => setFirstNameFocus(true)} 
          onBlur={() => setFirstNameFocus(false)}></Input>
        </InputGroup>
          <h5 className="title">Last Name</h5>
        <h5 className="description" hidden={editProfileState}>{lastNameState}</h5>
        <InputGroup 
        hidden={!editProfileState} className={"no-border input-lg" + (lastNameFocus ? " input-group-focus" : "")}>
          <Input value={lastNameState} type="text" style={{color:"#ffffff"}}
          onChange = {(e) => onChangeLastName(e)}
          onFocus={() => setLastNameFocus(true)} 
          onBlur={() => setLastNameFocus(false)}></Input>
        </InputGroup>
          <Button outline className="btn-round" size="md"
            onClick={(e) => {
              if (editProfileState) {saveUserProfile(e)} 
              setEditProfileState(!editProfileState)
          }}>{editProfileState ? ("Save Profile") : ("Edit Profile")}
          </Button>
          <Container>
          <Button outline className="btn-round" size="md"
            onClick={() => {}}>Change Password
          </Button>
          <Button outline className="btn-round" size="md"
            onClick={() => {}}>Change Email
          </Button>
          </Container>
          </Col>
          </Form>                                                 
        </Container>
      <TransparentFooter />
      </div>
    </>
  );
}

export default HomePrivate;