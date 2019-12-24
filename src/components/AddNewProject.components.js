import React from "react";
import {Redirect} from 'react-router'
import { Label, Button, Card, CardBody, CardFooter, Form, Input, InputGroup, Container, Col } from "reactstrap";
import axios from "axios";

// Import child components
import TransparentFooter from './TransparentFooter'

// 
import {fetchUserProfile, useAuthContext} from "../services/AuthReducer"

function AddNewProject() {
  let pageHeader = React.createRef();
  const auth = useAuthContext()

    // Fetch user
    const [userState, setUserState] = React.useState({
      'username':""
    })

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
    const onFireRedirectDashboard = () => {setFireRedirectDashboard(true)}
  
    // Define form save functions
    const onChangeProjectNameState = (e) => {setProjectNameState(e.target.value)};

    const onChangeProjectDescriptionState = (e) => {setProjectDescriptionState(e.target.value)};

    const onChangeMembersState = (e) => {
      setMembersState(e.target.value)
    };

    const onChangeAdminsState = (e) => {
      setAdminsState(e.target.value)
    };

    const onCreateProject = async (e) => { 
        try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/projects/add`, {
            "name": projectNameState,
            "description": projectDescriptionState,
            "members":membersState,
            "admins": adminsState
          },
          {
            withCredentials: true
          });
    
          if (!res.data.error) {
            console.log("added new project")
            onFireRedirectDashboard();

    
        }} catch (err) {
          console.log(err)
        }
      }
  
    // Additional form features
  

    React.useEffect(() => {
      document.body.classList.add("login-page");
      document.body.classList.add("sidebar-collapse");
      document.documentElement.classList.remove("nav-open");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      
      (async () => {
        const user = await fetchUserProfile(auth)
        setUserState({
          'username':user.username,
        })
        setMembersState([user.username])
        setAdminsState([user.username])
      })();
      
      return function cleanup() {
        document.body.classList.remove("login-page");
        document.body.classList.remove("sidebar-collapse");
      };
    }, [auth]);

  return (
    <>
    {fireRedirectDashboard && <Redirect to="/dashboard">push={true}</Redirect>}
      <div className="page-header clear-filter" filter-color="blue">
        <div className="page-header-image" style={{backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"}} ref={pageHeader}></div>
          <Container><h1 className="float-left">Create New Project</h1></Container>
          <Container>
            <Col className="mr-auto" md="6">
              <Card className="card-plain">
                <Form action="" className="form" method="">
                  <CardBody>
                    <Label className="float-left"><h6>Project Name</h6></Label>
                    <InputGroup className={"no-border input-lg" + (projectNameFocus ?  "input-group-focus" : "")}>
                      <Input type="text"
                        onChange={(e)=>onChangeProjectNameState(e)}
                        onFocus={() => setProjectNameFocus(true)}
                        onBlur={() => setProjectNameFocus(false)}></Input>
                    </InputGroup>
                    <Label className="float-left"><h6>Project Description</h6></Label>
                    <InputGroup className={"no-border input-lg" + (projectDescriptionFocus ? " input-group-focus" : "")}>
                      <Input type="textarea" 
                        onChange={(e)=>onChangeProjectDescriptionState(e)}
                        onFocus={() => setProjectDescriptionFocus(true)}
                        onBlur={() => setProjectDescriptionFocus(false)}></Input>
                    </InputGroup>
                    <Label className="float-left"><h6>Add Members</h6></Label>
                    <InputGroup>{membersState}</InputGroup>
                    <Label className="float-left"><h6>Add Admins</h6></Label>
                    <InputGroup>{adminsState}</InputGroup>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button outline block className="btn-round" onClick={(e) => {onCreateProject()}} size="lg">Create Project</Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
          <TransparentFooter />
      </div>
    </>
  );
}

export default AddNewProject;