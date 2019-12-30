import React from "react";
import { Redirect } from "react-router";
import axios from "axios";

import { UncontrolledPopover, PopoverBody, FormFeedback, FormGroup, Button, Card, CardBody, CardFooter, Form, Input, InputGroupAddon, Container, Col } from "reactstrap";

// Import child components
import Navbar from "./Navbar.components";
import TransparentFooter from "./TransparentFooter";

// import useAuth functions to set authState
import {useAuthContext} from '../services/AuthReducer'

// define email and password regexes
const emailRegex = RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)

function LoginPage () {
  const auth = useAuthContext()

  // FORM STATE HOOKS
  const [emailState, setEmailState] = React.useState("");
  const onChangeEmail = (e) => {setEmailState(e.target.value)};

  const [passwordState, setPasswordState] = React.useState("");
  const onChangePassword = (e) => {setPasswordState(e.target.value)};

  // FORM FUNCTIONALITY HOOKS
  const[showPassword, setShowPassword] = React.useState("password");
  const onShowPassword = () => {setShowPassword(!showPassword)};

  const[showPasswordButton, setShowPasswordButton] = React.useState("Show");
  const onShowPasswordButton = () => {setShowPasswordButton(!showPasswordButton)};

  // FORM FUNCTIONALITY HOOKS
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);
  const [emailIsValid, setEmailIsValid] = React.useState(false);
  const [emailHasInput, setEmailHasInput] = React.useState(false)
  const checkEmailIfValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setEmailHasInput(true);
      
      if (emailRegex.test(e.target.value)) {
        setEmailIsValid(true);
        setEmailHasInput(false); // To prevent override of valid field
      } else {
        setEmailIsValid(false);
      }

    } else {
      setEmailHasInput(false);
      setEmailIsValid(false);
    }
  };

  const [passwordIsValid, setPasswordIsValid] = React.useState(false);
  const [passwordHasInput, setPasswordHasInput] = React.useState(false)
  const checkPasswordIfValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setPasswordHasInput(true);
      
      if (passwordRegex.test(e.target.value)) {
        setPasswordIsValid(true);
        setPasswordHasInput(false); // To prevent override of valid field
      } else {
        setPasswordIsValid(false);
      }

    } else {
      setPasswordHasInput(false);
      setPasswordIsValid(false);
    }
  };

  const [showEmailPopover, setShowEmailPopover] = React.useState(false)
  const [emailPopoverMsg, setEmailPopoverMsg] = React.useState("")

  const [showPasswordPopover, setShowPasswordPopover] = React.useState(false)
  const [passwordPopoverMsg, setPasswordPopoverMsg] = React.useState("")

  // REDIRECT HOOKS
  const[fireRedirectHome, setFireRedirectHome] = React.useState(false)
  const onFireRedirectHome = () => {setFireRedirectHome(true)}

  const[fireRedirectRegister, setFireRedirectRegister] = React.useState(false)
  const onFireRedirectRegister = () => {setFireRedirectRegister(true)}

  // Define login function
  const onSubmitLogin = async (e) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/users/login`, {
        "email": emailState,
        "password": passwordState
      },
      {
        withCredentials: true
      });

      if (!res.data.error) {
        await auth.handleLogin();
        onFireRedirectHome(e);

    }} catch (err) {
    /** Error handling for login issues */
    if (err.response.data.description === "EMAIL_FIELD_EMPTY") {
      setShowEmailPopover(true)
      setShowPasswordPopover(false)
      setEmailPopoverMsg("Email field is empty.")
    }
    else if (err.response.data.description === "PASSWORD_FIELD_EMPTY") {
      setShowPasswordPopover(true)
      setShowEmailPopover(false)
      setPasswordPopoverMsg("Password field is empty.")
    }
    else if (err.response.data.description === "USER_NOT_FOUND") {
      setShowEmailPopover(true)
      setShowPasswordPopover(false)
      setEmailPopoverMsg("User was not found.")
    }
    else if (err.response.data.description === "PASSWORD_DOES_NOT_MATCH") {
      setShowPasswordPopover(true)
      setShowEmailPopover(false)
      setPasswordPopoverMsg("Incorrect password.")
    }
    else {
      throw new Error("Uncaught error: " + err)
    }
  }
};

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
  return (
    <>
      <Navbar />
      {fireRedirectHome && <Redirect to='/dashboard'> push={true} </Redirect>}
      {fireRedirectRegister && <Redirect to='/register'> push={true}</Redirect>}
      <div className="page-header clear-filter" filter-color="blue">
        <div className="page-header-image" style={{backgroundImage: "url(" + require("../assets/img/login.jpg") + ")"}}></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form action="" className="form" method="">
                  <Container>
                    <h3 className="h3 seo">Welcome back to Stream.</h3>
                  </Container>
                  <CardBody>
                    <FormGroup className={"no-border input-lg" + (emailFocus ? " input-group-focus" : "")}>
                      <Input 
                      id="emailField"
                      autoComplete="username" 
                      valid={emailIsValid} invalid={emailHasInput}
                      placeholder="Email"
                      onChange={(e)=>{onChangeEmail(e); checkEmailIfValid(e)}} 
                      onFocus={() => setEmailFocus(true)} 
                      onBlur={() => setEmailFocus(false)}>
                      </Input><FormFeedback>Invalid email.</FormFeedback>
                      <UncontrolledPopover trigger="focus" toggle={()=>{setShowEmailPopover(false)}} placement="right" isOpen={showEmailPopover} target="emailField">
                        <PopoverBody>{emailPopoverMsg}</PopoverBody>
                      </UncontrolledPopover>
                    </FormGroup>
                    <FormGroup className={"no-border input-lg" + (passwordFocus ? " input-group-focus" : "")}>
                      <InputGroupAddon addonType="prepend">
                      </InputGroupAddon>
                      <Input
                      autoComplete="current-password" 
                      id="passwordField" 
                      valid={passwordIsValid} invalid={passwordHasInput} 
                      placeholder="Password"
                      type={(showPassword ? "password": "text")}
                      onChange={(e)=>{onChangePassword(e); checkPasswordIfValid(e);}}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      ></Input><FormFeedback>Password must be between 8 to 20 characters, 1 uppercase and 1 lowercase letter.</FormFeedback>
                      <UncontrolledPopover trigger="click" toggle={()=>{setShowPasswordPopover(false)}}placement="right" isOpen={showPasswordPopover} target="passwordField">
                        <PopoverBody>{passwordPopoverMsg}</PopoverBody>
                      </UncontrolledPopover>
                    </FormGroup>
                    <div className="col-md-auto">
                      <Button outline className="btn-round" size="md" onClick={(e) => {
                          onShowPassword(e)
                          onShowPasswordButton(e)
                        }}>{(showPasswordButton) ? "Show Password":"Hide Password"}</Button>
                    </div>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button outline block className="btn-round" size="lg" onClick={(e) => {
                      onSubmitLogin(e)
                    }}>Login</Button>
                    <div className="pull-left"><h6><a className="link" href="/register" onClick={
                      () => onFireRedirectRegister()
                    }>Register</a></h6>
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