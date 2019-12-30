import React from "react";
import { Col, Row, Label, Button, Card, CardBody, CardFooter, Form, Input, InputGroup, Container } from "reactstrap";
import { Link } from 'react-router-dom';
import axios from "axios";

// Import child components
import TransparentFooter from './TransparentFooter';
import SearchBar from './AddUserSearchBar.components';
import { useAuthContext } from "../services/AuthReducer";
import ProjectSpinner from "./ProjectSpinner.components";

const EditProject = (props) => {
  let pageHeader = React.createRef();
  const auth = useAuthContext()

    // Fetch user
    const [projectData, setProjectData] = React.useState({
      "username":"",
      "description":"",
      "members": [],
      "admins": []
    });

    // Edit project
    const [editProjectState, setEditProjectState] = React.useState(false)

    // Create state to store entered username and pw
    const [projectNameState, setProjectNameState] = React.useState("");
    const [projectDescriptionState, setProjectDescriptionState] = React.useState("");
    const [membersState, setMembersState] = React.useState([]);
    const [adminsState, setAdminsState] = React.useState([]);
    
    // Create state for focus; leave out for members and admins
    const [projectNameFocus, setProjectNameFocus] = React.useState(false);
    const [projectDescriptionFocus, setProjectDescriptionFocus] = React.useState(false);

    // Create state for reload
    const onFireReload = () => {
      window.location.reload();
    }
  
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

    const onChangeEditProjectState = () => {
      setEditProjectState(!editProjectState);
    };

    const onUpdateProject = async () => { 
      try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/projects/update/all/${props.match.params.projectName}`, {
            "name": projectNameState,
            "description": projectDescriptionState,
            "members": membersState,
            "admins": adminsState
          },
          {
            withCredentials: true
          });
    
          if (!res.data.error) {
            onFireReload();
    
        }} catch (err) {
          console.log(err)
        }
      }; 
  
    // Additional form features
    React.useEffect(() => {
      document.body.classList.add("login-page");
      document.body.classList.add("sidebar-collapse");
      document.documentElement.classList.remove("nav-open");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;

      // Fetch projectData
      const source = axios.CancelToken.source(); // Generate cancellation token
      (async () => {
          try {
              const res = await axios.get(`${process.env.REACT_APP_BASE_SERVER_URL}/projects/find/${props.match.params.projectName}`, 
              {
                  withCredentials: true,
                  cancelToken: source.token
              }
              );

              if (!res.data.error) {
                  setProjectData(res.data);
              };
          } catch (err) {
              if (axios.isCancel(err)) {
                  console.log("axios call cancelled")
              } else {
                  throw err;
              }
          };
      })();

      return function cleanup() {
        document.body.classList.remove("login-page");
        document.body.classList.remove("sidebar-collapse");
      };

    }, []);

  return (
    <>
    <div 
    className="page-header clear-filter" 
    filter-color="blue">
      <div 
      className="page-header-image" 
      style={{backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"}} 
      ref={pageHeader}></div>
        <Container>
          <h1 
          className="float-left">Edit Project</h1>
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
                  <h5 
                  hidden={editProjectState}>{projectData.name ? projectData.name : <ProjectSpinner />}</h5>
                    <Input 
                    hidden={!editProjectState}
                    value={projectData.name}
                    type="text"
                    onChange={(e)=>onChangeProjectNameState(e)}
                    onFocus={() => setProjectNameFocus(true)}
                    onBlur={() => setProjectNameFocus(false)}></Input>
                  </InputGroup>
                  <Label 
                  className="float-left"><h6>Project Description</h6></Label>
                  <InputGroup 
                  className={"no-border input-lg" + (projectDescriptionFocus ? " input-group-focus" : "")}>
                    <h5
                    hidden={editProjectState}>{projectData.description ? projectData.description : <ProjectSpinner />}</h5>
                    <Input
                    hidden={!editProjectState}
                    value={projectData.description}
                    type="textarea" 
                    onChange={(e)=>onChangeProjectDescriptionState(e)}
                    onFocus={() => setProjectDescriptionFocus(true)}
                    onBlur={() => setProjectDescriptionFocus(false)}></Input>
                  </InputGroup>
                  <Label className="float-left"><h6>Members</h6></Label>
                  <InputGroup>
                    { editProjectState ? 
                    <SearchBar 
                    hidden={!editProjectState}
                    onChangeParentCompUsersState={onChangeMembersState} 
                    searchBarId={1}/> : 
                    projectData.members.map(member => {
                      return <Col key={member}>{member}</Col>
                      })}
                  </InputGroup>
                  <Label className="float-left"><h6>Admins</h6></Label>
                  <InputGroup>
                  { editProjectState ? 
                    <SearchBar 
                    hidden={!editProjectState}
                    onChangeParentCompUsersState={onChangeAdminsState} 
                    searchBarId={2}/> : 
                    projectData.admins.map(admin => {
                      return <Col key={admin}>{admin}</Col>
                      })}
                  </InputGroup>
                </CardBody>
                <CardFooter className="text-center">
                  <Button 
                  outline 
                  className="btn-round" 
                  size="lg"
                  onClick={onChangeEditProjectState}>{editProjectState ? ("Save Project") : ("Edit Project")}</Button>
                  <Link to="/dashboard"><Button 
                  outline 
                  className="btn-round" 
                  size="lg">Return to Dashboard</Button>
                  </Link>
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

export default EditProject;