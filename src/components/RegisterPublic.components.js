import React from "react";
import axios from 'axios';
import {Redirect} from 'react-router'

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col
} from "reactstrap";

// core components
import Navbar from "./Navbar.components";
import TransparentFooter from "./TransparentFooter";

const LoginPage = () => {

  // Define state variables for register form
  const[usernameState, setUsernameState] = React.useState("")
  const[firstNameState, setFirstNameState] = React.useState("")
  const[lastNameState, setLastNameState] = React.useState("")
  const[emailState, setEmailState] = React.useState("")
  const[passwordState, setPasswordState] = React.useState("")

  // Additional form features
  const[fireRedirect, setFireRedirect] = React.useState(false)
  const[showPassword, setShowPassword] = React.useState("password")
  const[showPasswordButton, setShowPasswordButton] = React.useState("Show")

  // Define functions to set states of register form variables
  const onChangeUsername = (e) => {
    setUsernameState(e.target.value)
  };
  const onChangeFirstName = (e) => {
    setFirstNameState(e.target.value)
  };
  const onChangeLastName = (e) => {
    setLastNameState(e.target.value)
  };
  const onChangeEmail = (e) => {
    setEmailState(e.target.value)
  };
  const onChangePassword = (e) => {
    setPasswordState(e.target.value)
  };
  const onFireRedirect = (e) => {
    setFireRedirect(true)
  }
  const onShowPassword = (e) => {
    setShowPassword(!showPassword)
  }
  const onShowPasswordButton = (e) => {
    setShowPasswordButton(!showPasswordButton)
  }

  // Define function for form submission
  const submitForm = (e) => {
    console.log('Run submitForm...')
    e.preventDefault();

    const user = {
      "username": usernameState,
      "firstname": firstNameState,
      "lastname": lastNameState,
      "email": emailState,
      "password": passwordState
    }

    // Send JSON object to backend endpoint
    axios.post('http://localhost:5000/users/add', user)
      .then(res => {
        if (!res.data.error) {
          console.log('React - User added successfully')
          onFireRedirect(e)
        } else {
          console.log("Error: " + res.data.error)
        }
      })
      .catch(err => console.log("Error: " + err))
  }; 

  // Define state variables for focus feature
  const [usernameFocus, setUsernameFocus] = React.useState(false);
  const [firstNameFocus, setFirstNameFocus] = React.useState(false);
  const [lastNameFocus, setLastNameFocus] = React.useState(false);
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);

  // Set initial conditions for page
  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  // BODY
  return (
    <>
      <Navbar />
      {fireRedirect && <Redirect to='/'> push={true} </Redirect>}
      <div 
        className="page-header clear-filter" 
        filter-color="blue">
        <div 
          className="page-header-image" 
          style={{backgroundImage: "url(" + require("../assets/img/register.jpg") + ")"}}
          ></div>
        <div 
          className="content">
          <Container>
            <Col 
              className="ml-auto mr-auto" 
              md="4">
              <Card 
                className="card-login card-plain">
                <Form 
                  onSubmit = {submitForm} 
                  className="form" 
                  method="POST">
                  <Container>
                    <h3 
                      className="h3 seo">
                        Start your journey with Stream.
                    </h3>
                  </Container>
                <CardBody>
                  <InputGroup 
                    className={"no-border input-lg" + (usernameFocus ? " input-group-focus" : "")}>
                      <InputGroupAddon 
                        addonType="prepend">
                        <InputGroupText>
                          <i 
                            className="now-ui-icons users_circle-08"
                          ></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="Username" 
                        type="text"
                        onChange = {(e) => onChangeUsername(e)}
                        onFocus={() => setUsernameFocus(true)} 
                        onBlur={() => setUsernameFocus(false)}
                      ></Input>
                    </InputGroup>
                    <InputGroup 
                      className={ "no-border input-lg" + (firstNameFocus ? " input-group-focus" : "")}>
                      <InputGroupAddon 
                        addonType="prepend">
                        <InputGroupText>
                          <i 
                            className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="First name" 
                        type="text" 
                        onChange ={(e) => onChangeFirstName(e)}
                        onFocus={() => setFirstNameFocus(true)} 
                        onBlur={() => setFirstNameFocus(false)} ></Input>
                    </InputGroup>
                    <InputGroup 
                      className={"no-border input-lg" + (lastNameFocus ? " input-group-focus" : "")}>
                      <InputGroupAddon 
                        addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Last name"
                        type="text"
                        onChange ={(e) => onChangeLastName(e)}
                        onFocus={() => setLastNameFocus(true)}
                        onBlur={() => setLastNameFocus(false)}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (emailFocus? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_email-85"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="text"
                        onChange = {(e) => onChangeEmail(e)}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      ></Input>
                    </InputGroup>
                    <div className="container">
                      <div className="row">
                        <div className="col-lg">
                          <InputGroup
                            className={
                              "no-border input-lg" +
                              (passwordFocus ? " input-group-focus" : "")
                            }
                          >
                            <InputGroupAddon 
                              addonType="prepend">
                              <InputGroupText>
                                <i 
                                  className="now-ui-icons ui-1_lock-circle-open"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder= "Password  "
                              type={(showPassword ? "password": "text")}
                              onChange={(e)=>{onChangePassword(e)}}
                              onFocus={() => setPasswordFocus(true)}
                              onBlur={() => setPasswordFocus(false)}
                            ></Input>
                          </InputGroup>
                          </div>
                          <div className="col-md-auto">
                            <Button 
                              outline 
                              className="btn-round"
                              size="md"
                              onClick={(e) => {
                                onShowPassword(e)
                                onShowPasswordButton(e)
                              }}
                              >{(showPasswordButton) ? "Show":"Hide"}
                            </Button>
                          </div>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter 
                    className="text-center">
                    <Button
                      block
                      className="btn-round"
                      color="info"
                      type="submit"
                      size="lg"
                    >
                      Register
                    </Button>
                    <div 
                      className="pull-left">
                      <h6>
                      <a
                      className="link"
                      href="/login"
                      onClick={() => "window.location='/login'"}
                      >
                        Login with Stream Account
                        </a></h6>
                    </div>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
        <TransparentFooter />
      </div>
    </>
  );
}

export default LoginPage;