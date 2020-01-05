import React from "react";
import { Redirect } from "react-router";
import { Label, Button, Card, CardBody, CardFooter, Form, Input, InputGroup, Container, Col } from "reactstrap";
import axios from "axios";

// Import child components
import TransparentFooter from './TransparentFooter';
import SearchBar from './AddUserSearchBar.components';

// Import services
import { fetchUserProfile, useAuthContext } from "../services/AuthReducer";

const AddNewProject = () => {
  let pageHeader = React.createRef();
  const auth = useAuthContext()

    // Create state to store entered username and pw
    const [projectNameState, setProjectNameState] = React.useState("");
    const [projectDescriptionState, setProjectDescriptionState] = React.useState("");
    const [membersState, setMembersState] = React.useState([]);
    const [adminsState, setAdminsState] = React.useState([]);
    
    // Create state for focus; leave out for members and admins
    const [projectNameFocus, setProjectNameFocus] = React.useState(false);
    const [projectDescriptionFocus, setProjectDescriptionFocus] = React.useState(false);

    // Create state for redirect
    const [fireRedirectDashboard, setFireRedirectDashboard] = React.useState(false)
    const onFireRedirectDashboard = () => {
      setFireRedirectDashboard(true)
    };
  
    // Define form save functions
    const onChangeProjectNameState = (e) => {
      setProjectNameState(e.target.value);
    };

    const onChangeProjectDescriptionState = (e) => {
      setProjectDescriptionState(e.target.value)
    };

    const onChangeMembersState = (newMembersState) => {
      setMembersState(newMembersState);
    };

    const onChangeAdminsState = (newAdminsState) => {
      setAdminsState(newAdminsState);
    };

    const onFocusProjectName = () => {
      setProjectNameFocus(true);
    };

    const onBlurProjectName = () => {
      setProjectNameFocus(false);
    };

    const onFocusProjectDescription = () => {
      setProjectDescriptionFocus(true);
    };

    const onBlurProjectDescription = () => {
      setProjectDescriptionFocus(false);
    };

    const onCreateProject = async () => { 
      try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/projects/add`, {
            "name": projectNameState,
            "description": projectDescriptionState,
            "members": membersState,
            "admins": adminsState
          },
          {
            withCredentials: true
          });
    
          if (!res.data.error) {
            onFireRedirectDashboard();
    
        }
      } catch (err) {
          console.log(err)
        }
      };

    const onFireCreateProject = () => {
      onCreateProject();
    };
  
    React.useEffect(() => {
      // Additional form features
      document.body.classList.add("login-page");
      document.body.classList.add("sidebar-collapse");
      document.documentElement.classList.remove("nav-open");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      
      // Fetch user data and set admin to hold username of current logged-in user
      // (async () => {
      //   const user = await fetchUserProfile(auth)
      //   setAdminsState([user.username])
      // })();
      
      return function cleanup() {
        document.body.classList.remove("login-page");
        document.body.classList.remove("sidebar-collapse");
      };
    }, [auth]);

  return (
    <>
    {fireRedirectDashboard && <Redirect to="/dashboard">push={true}</Redirect>}
      <div 
      className="page-header clear-filter" 
      filter-color="blue">
        <div 
        className="page-header-image" 
        style={{backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"}} 
        ref={pageHeader}></div>
          <Container>
            <h1 
            className="float-left">Create New Project</h1>
          </Container>
          <Container>
            <Col 
            className="mr-auto" 
            md="6">
              <Card 
              className="card-plain">
                <Form 
                action="" 
                className="form" 
                method="">
                  <CardBody>
                    <Label 
                    className="float-left">
                      <h6>Project Name</h6>
                    </Label>
                    <InputGroup 
                    className={"no-border input-lg" + (projectNameFocus ?  "input-group-focus" : "")}>
                      <Input 
                      type="text"
                      onChange={onChangeProjectNameState}
                      onFocus={onFocusProjectName}
                      onBlur={onBlurProjectName}></Input>
                    </InputGroup>
                    <Label 
                    className="float-left">
                      <h6>Project Description</h6>
                    </Label>
                    <InputGroup 
                    className={"no-border input-lg" + (projectDescriptionFocus ? " input-group-focus" : "")}>
                      <Input 
                      type="textarea" 
                      onChange={onChangeProjectDescriptionState}
                      onFocus={onFocusProjectDescription}
                      onBlur={onBlurProjectDescription}>
                      </Input>
                    </InputGroup>
                    <Label 
                    className="float-left">
                      <h6>Add Members</h6>
                    </Label>
                    <InputGroup>
                      <SearchBar
                      onChangeParentCompUsersState={onChangeMembersState}
                      searchBarId={1}
                      isOutline={true} />
                    </InputGroup>
                    <Label className="float-left"><h6>Add Admins</h6></Label>
                    <InputGroup>
                      <SearchBar
                      onChangeParentCompUsersState={onChangeAdminsState}
                      searchBarId={2}
                      isOutline={true} />
                    </InputGroup>
                  </CardBody>
                  <CardFooter 
                  className="text-center">
                    <Button 
                    outline 
                    block 
                    className="btn-round" 
                    onClick={onFireCreateProject} 
                    size="lg">Create Project</Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
          <TransparentFooter />
      </div>
    </>
  );
};

export default AddNewProject;