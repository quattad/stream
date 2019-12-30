/*eslint-disable*/
import React from "react";
import { Button, Container, Form, Input, InputGroup, Col} from "reactstrap";
import axios from "axios";

// Import child components
import TransparentFooter from './TransparentFooter';
import ProjectSpinner from './ProjectSpinner.components';

// Import services
import { useAuthContext, checkAuth } from "../services/AuthReducer";

const ProfilePrivate = () => {
  const auth = useAuthContext();

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_SERVER_URL}/users/profile`, 
      {
        withCredentials: true
      });
      
      if (!res.data.error) {
        setUsernameState(res.data.username);
        setFirstNameState(res.data.firstname);
        setLastNameState(res.data.lastname);
      };
    
    } catch (err) {
      console.log(err);
      auth.handleLogout();
  };
};

  // Define states
  const[usernameState, setUsernameState] = React.useState("")
  const[firstNameState, setFirstNameState] = React.useState("")
  const[lastNameState, setLastNameState] = React.useState("")
  const[editProfileState, setEditProfileState] = React.useState("")

  // Define functions to set states of register form variables
  const onChangeUsername = (e) => {
    setUsernameState(e.target.value);
  };
  const onChangeFirstName = (e) => {
    setFirstNameState(e.target.value);
  };
  const onChangeLastName = (e) => {
    setLastNameState(e.target.value);
  };

  // Define state variables for focus feature
  const [usernameFocus, setUsernameFocus] = React.useState(false);
  const [firstNameFocus, setFirstNameFocus] = React.useState(false);
  const [lastNameFocus, setLastNameFocus] = React.useState(false);

  const onFireUsernameFocus = () => {
    setUsernameFocus(true);
  };

  const onFireUsernameBlur = () => {
    setUsernameFocus(false);
  };

  const onFireFirstNameFocus = () => {
    setFirstNameFocus(true);
  };

  const onFireFirstNameBlur = () => {
    setFirstNameFocus(false);
  };

  const onFireLastNameFocus = () => {
    setLastNameFocus(true);
  };

  const onFireLastNameBlur = () => {
    setLastNameFocus(false);
  };

  // Define function for form submission to update user profile
  const saveUserProfile = async (e) => {
    e.preventDefault();

    const updateUser = {
      "username": usernameState,
      "firstname": firstNameState,
      "lastname": lastNameState,
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/users/update`, 
      updateUser,
      {
        withCredentials:true
      }
      );
    
    } catch (err) {
      console.log(err)
    };
  };

const onFireSaveProfile = (e) => {
  if (editProfileState) {
    saveUserProfile(e);
  }; 
  setEditProfileState(!editProfileState);
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
      <div 
      className="page-header clear-filter" 
      filter-color="blue">
        <div 
        className="page-header-image" 
        style={{backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"}}
        ref={pageHeader}>
        </div>
        <Container>
          <Form 
          onSubmit={saveUserProfile} 
          className="form" 
          method="POST">
            <Col 
            className="ml-auto mr-auto" 
            md="4">
              <h5 
              className="title">Username</h5>
              <h5 
              className="description" 
              hidden={editProfileState}>{usernameState ? usernameState : <ProjectSpinner />}</h5>
              <InputGroup 
              hidden={!editProfileState} 
              className={"no-border input-lg" + (usernameFocus ? " input-group-focus" : "")}>
                <Input 
                value={usernameState}
                type="text" 
                style={{color:"#ffffff"}}
                onChange = {onChangeUsername}
                onFocus={onFireFirstNameFocus} 
                onBlur={onFireFirstNameBlur}></Input>
                </InputGroup>
                <h5 
                className="title">First Name</h5>
                <h5 
                className="description" 
                hidden={editProfileState}>{firstNameState ? firstNameState : <ProjectSpinner />}</h5>
                <InputGroup 
                hidden={!editProfileState} 
                className={"no-border input-lg" + (firstNameFocus ? " input-group-focus" : "")}>
                  <Input 
                  value={firstNameState} 
                  type="text" 
                  style={{color:"#ffffff"}}
                  onChange = {onChangeFirstName}
                  onFocus={onFireUsernameFocus} 
                  onBlur={onFireUsernameBlur}></Input>
                  </InputGroup>
                  <h5 
                  className="title">Last Name</h5>
                  <h5 
                  className="description" 
                  hidden={editProfileState}>{lastNameState ? lastNameState : <ProjectSpinner />}</h5>
                  <InputGroup 
                  hidden={!editProfileState} 
                  className={"no-border input-lg" + (lastNameFocus ? " input-group-focus" : "")}>
                    <Input 
                    value={lastNameState} 
                    type="text" style={{color:"#ffffff"}}
                    onChange = {onChangeLastName}
                    onFocus={onFireLastNameFocus} 
                    onBlur={onFireLastNameBlur}></Input>
                  </InputGroup>
                  <Button 
                  outline 
                  className="btn-round" 
                  size="md"
                  onClick={onFireSaveProfile}>{editProfileState ? ("Save Profile") : ("Edit Profile")}
                  </Button>
                  {/* Commented until Change Password and Change Email features implemented */}
                  {/* <Container> */}
                  {/* <Button outline className="btn-round" size="md"
                    onClick={() => {}}>Change Password
                  </Button>
                  <Button outline className="btn-round" size="md"
                    onClick={() => {}}>Change Email
                  </Button> */}
                  {/* </Container> */}
            </Col>
          </Form>                                                 
        </Container>
      <TransparentFooter />
      </div>
    </>
  );
};

export default ProfilePrivate;