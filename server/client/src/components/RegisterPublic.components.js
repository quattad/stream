import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router'

// reactstrap components
import { Button, Card, CardBody, CardFooter, Form, FormGroup, Input, Container, Col, FormFeedback, UncontrolledPopover, PopoverBody } from "reactstrap";

// core components
import Navbar from "./Navbar.components";
import TransparentFooter from "./TransparentFooter";

const RegisterPublic = () => {
  
  // Define state variables for register form
  const [usernameState, setUsernameState] = React.useState("")
  const [firstNameState, setFirstNameState] = React.useState("")
  const [lastNameState, setLastNameState] = React.useState("")
  const [emailState, setEmailState] = React.useState("")
  const [passwordState, setPasswordState] = React.useState("")

  // Additional form features
  const [fireRedirect, setFireRedirect] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState("password");
  const [showPasswordButton, setShowPasswordButton] = React.useState("Show");

  // Form validity regex
  const usernameRegex = RegExp(/^[A-Za-z\d@$!]{5,30}$/);  // can contain A-Z, a-z, special chars @$!, between 5 to 10
  const firstNameRegex = RegExp(/^[A-Za-z]{1,10}$/); // can contain A-z, a-z, char length between 1 to 10
  const lastNameRegex = RegExp(/^[A-Za-z]{1,10}$/); // can contain A-z, a-z, char length between 1 to 10
  const emailRegex = RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
  const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/);

  // Form validity hooks
  const [usernameHasInput, setUsernameHasInput] = React.useState(false);
  const [usernameIsValid, setUsernameIsValid] = React.useState(false);
  const [firstNameHasInput, setFirstNameHasInput] = React.useState(false);
  const [firstNameIsValid, setFirstNameIsValid] = React.useState(false);
  const [lastNameHasInput, setLastNameHasInput] = React.useState(false);
  const [lastNameIsValid, setLastNameIsValid] = React.useState(false);
  const [emailHasInput, setEmailHasInput] = React.useState(false);
  const [emailIsValid, setEmailIsValid] = React.useState(false);
  const [passwordHasInput, setPasswordHasInput] = React.useState(false);
  const [passwordIsValid, setPasswordIsValid] = React.useState(false);

  // Form validity functions
  const checkUsernameIsValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setUsernameHasInput(true);

      if (usernameRegex.test(e.target.value)) {
        setUsernameIsValid(true);
        setUsernameHasInput(false);  // prevent override of valid field
      } else {
        setUsernameIsValid(false);
      };
    } else {
      setUsernameHasInput(false);
      setUsernameIsValid(false);
    };
  };

  const checkFirstNameIsValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setFirstNameHasInput(true);

      if (firstNameRegex.test(e.target.value)) {
        setFirstNameIsValid(true);
        setFirstNameHasInput(false);  // prevent override of valid field
      } else {
        setFirstNameIsValid(false);
      };
    } else {
      setFirstNameHasInput(false);
      setFirstNameIsValid(false);
    };
  };

  const checkLastNameIsValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setLastNameHasInput(true);

      if (lastNameRegex.test(e.target.value)) {
        setLastNameIsValid(true);
        setLastNameHasInput(false);  // prevent override of valid field
      } else {
        setLastNameIsValid(false);
      };
    } else {
      setLastNameHasInput(false);
      setLastNameIsValid(false);
    };
  };

  const checkEmailIsValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setEmailHasInput(true);

      if (emailRegex.test(e.target.value)) {
        setEmailIsValid(true);
        setEmailHasInput(false);  // prevent override of valid field
      } else {
        setEmailIsValid(false);
      };
    } else {
      setEmailHasInput(false);
      setEmailIsValid(false);
    };
  };

  const checkPasswordIsValid = (e) => {
    e.preventDefault();

    if (e.target.value.length > 0) {
      setPasswordHasInput(true);

      if (passwordRegex.test(e.target.value)) {
        setPasswordIsValid(true);
        setPasswordHasInput(false);  // prevent override of valid field
      } else {
        setPasswordIsValid(false);
      };
    } else {
      setPasswordHasInput(false);
      setPasswordIsValid(false);
    };
  };

  // Field popup and truthy states
  const [ usernamePopoverMsg, setUsernamePopoverMsg ] = React.useState("");
  const [ showUsernamePopoverMsg, setShowUsernamePopoverMsg ] = React.useState(false); 
  const [ firstNamePopoverMsg, setFirstNamePopoverMsg ] = React.useState("");
  const [ showFirstNamePopoverMsg, setShowFirstNamePopoverMsg ] = React.useState(false); 
  const [ lastNamePopoverMsg, setLastNamePopoverMsg ] = React.useState("");
  const [ showLastNamePopoverMsg, setShowLastNamePopoverMsg ] = React.useState(false); 
  const [ emailPopoverMsg, setEmailPopoverMsg ] = React.useState("");
  const [ showEmailPopoverMsg, setShowEmailPopoverMsg ] = React.useState(false); 
  const [ passwordPopoverMsg, setPasswordPopoverMsg ] = React.useState("");
  const [ showPasswordPopoverMsg, setShowPasswordPopoverMsg ] = React.useState(false); 

  // Define functions to set states of register form variables
  const onChangeUsername = (e) => {
    setUsernameState(e.target.value);
    checkUsernameIsValid(e);
  };

  const onChangeFirstName = (e) => {
    setFirstNameState(e.target.value);
    checkFirstNameIsValid(e);
  };

  const onChangeLastName = (e) => {
    setLastNameState(e.target.value);
    checkLastNameIsValid(e);
  };

  const onChangeEmail = (e) => {
    setEmailState(e.target.value);
    checkEmailIsValid(e);
  };

  const onChangePassword = (e) => {
    setPasswordState(e.target.value);
    checkPasswordIsValid(e);
  };

  const onFireRedirectLogin = () => {
    setFireRedirect(true);
  };

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onShowPasswordButton = () => {
    setShowPasswordButton(!showPasswordButton);
  };

  const onFireShowPassword = (e) => {
      onShowPassword(e);
      onShowPasswordButton(e);
  };

  // Define function for form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const user = {
      "username": usernameState,
      "firstname": firstNameState,
      "lastname": lastNameState,
      "email": emailState,
      "password": passwordState
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/users/add`, user);

      if (!res.data.error) {
        onFireRedirectLogin(e);
      };
      
    } catch (err) {
      // Extract first error from validationError
      const error = err.response.data.description["errors"][0];

      /** Error handling for registration */
      if (error.param === "username") {

        setShowUsernamePopoverMsg(true);
        setShowFirstNamePopoverMsg(false);
        setShowLastNamePopoverMsg(false);
        setShowEmailPopoverMsg(false);
        setShowPasswordPopoverMsg(false);
        setUsernamePopoverMsg(error.msg);

      } else if (error.param === "firstname") {

        setShowUsernamePopoverMsg(false);
        setShowFirstNamePopoverMsg(true);
        setShowLastNamePopoverMsg(false);
        setShowEmailPopoverMsg(false);
        setShowPasswordPopoverMsg(false);
        setFirstNamePopoverMsg(error.msg);

      } else if (error.param === "lastname") {

        setShowUsernamePopoverMsg(false);
        setShowFirstNamePopoverMsg(false);
        setShowLastNamePopoverMsg(true);
        setShowEmailPopoverMsg(false);
        setShowPasswordPopoverMsg(false);
        setLastNamePopoverMsg(error.msg);

      } else if (error.param === "email") {

        setShowUsernamePopoverMsg(false);
        setShowFirstNamePopoverMsg(false);
        setShowLastNamePopoverMsg(false);
        setShowEmailPopoverMsg(true);
        setShowPasswordPopoverMsg(false);
        setEmailPopoverMsg(error.msg);

      } else if (error.param === "password") {

        setShowUsernamePopoverMsg(false);
        setShowFirstNamePopoverMsg(false);
        setShowLastNamePopoverMsg(false);
        setShowEmailPopoverMsg(false);
        setShowPasswordPopoverMsg(true);
        setPasswordPopoverMsg(error.msg);

      };
    };
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
                onSubmit={submitForm} 
                className="form" 
                method="POST">
                  <Container>
                    <h3 
                    className="h3 seo">
                      Start your journey with Stream.
                    </h3>
                  </Container>
                <CardBody>
                  <FormGroup 
                  className={"no-border input-lg" + (usernameFocus ? " input-group-focus" : "")}>
                      <Input
                      id="usernameField"
                      valid={usernameIsValid}
                      invalid={usernameHasInput} 
                      placeholder="Username" 
                      type="text"
                      onChange = {onChangeUsername}
                      onFocus={() => setUsernameFocus(true)} 
                      onBlur={() => setUsernameFocus(false)}></Input>
                      <FormFeedback>Username should be between 5 to 30 characters.</FormFeedback>
                      <UncontrolledPopover 
                      trigger="focus" 
                      toggle={()=>{setShowUsernamePopoverMsg(false)}} 
                      placement="right" 
                      isOpen={showUsernamePopoverMsg} 
                      target="usernameField">
                        <PopoverBody>{usernamePopoverMsg}</PopoverBody>
                      </UncontrolledPopover>
                    </FormGroup>
                    <FormGroup 
                      className={ "no-border input-lg" + (firstNameFocus ? " input-group-focus" : "")}>
                      <Input
                      id="firstNameField"
                      valid={firstNameIsValid}
                      invalid={firstNameHasInput} 
                      placeholder="First name" 
                      type="text" 
                      onChange ={onChangeFirstName}
                      onFocus={() => setFirstNameFocus(true)} 
                      onBlur={() => setFirstNameFocus(false)} ></Input>
                      <FormFeedback>First name should be between 1 to 10 characters.</FormFeedback>
                      <UncontrolledPopover 
                      trigger="focus" 
                      toggle={()=>{setShowFirstNamePopoverMsg(false)}} 
                      placement="right" 
                      isOpen={showFirstNamePopoverMsg} 
                      target="firstNameField">
                        <PopoverBody>{firstNamePopoverMsg}</PopoverBody>
                        </UncontrolledPopover>
                    </FormGroup>
                    <FormGroup 
                    className={"no-border input-lg" + (lastNameFocus ? " input-group-focus" : "")}>
                      <Input
                      id="lastNameField"
                      valid={lastNameIsValid}
                      invalid={lastNameHasInput}
                      placeholder="Last name"
                      type="text"
                      onChange ={onChangeLastName}
                      onFocus={() => setLastNameFocus(true)}
                      onBlur={() => setLastNameFocus(false)}
                      ></Input><FormFeedback>Last name should be between 1 to 10 characters.</FormFeedback>
                        <UncontrolledPopover 
                        trigger="focus" 
                        toggle={()=>{setShowLastNamePopoverMsg(false)}} 
                        placement="right" 
                        isOpen={showLastNamePopoverMsg} 
                        target="lastNameField">
                        <PopoverBody>{lastNamePopoverMsg}</PopoverBody>
                        </UncontrolledPopover>
                    </FormGroup>
                    <FormGroup className={"no-border input-lg" + (emailFocus? " input-group-focus" : "")}>
                      <Input
                      id="emailField"
                      valid={emailIsValid}
                      invalid={emailHasInput}
                      placeholder="Email"
                      type="text"
                      onChange = {onChangeEmail}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      ></Input><FormFeedback>Invalid email.</FormFeedback>
                      <UncontrolledPopover 
                      trigger="focus" 
                      toggle={()=>{setShowEmailPopoverMsg(false)}} 
                      placement="right" 
                      isOpen={showEmailPopoverMsg} 
                      target="emailField">
                        <PopoverBody>{emailPopoverMsg}</PopoverBody>
                      </UncontrolledPopover>
                    </FormGroup>
                    <div 
                    className="container">
                      <div 
                      className="row">
                        <div 
                        className="col-lg">
                          <FormGroup 
                          className={"no-border input-lg" + (passwordFocus ? " input-group-focus" : "")}>
                            <Input
                            id="passwordField"
                            valid={passwordIsValid}
                            invalid={passwordHasInput}
                            placeholder="Password"
                            type={(showPassword ? "password": "text")}
                            onChange={onChangePassword}
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                            ></Input><FormFeedback>Password must be between 8 to 20 characters, 1 uppercase and 1 lowercase letter.</FormFeedback>
                          </FormGroup>
                          <UncontrolledPopover 
                          trigger="focus" 
                          toggle={()=>{setShowPasswordPopoverMsg(false)}} 
                          placement="right" 
                          isOpen={showPasswordPopoverMsg} 
                          target="passwordField">
                        <PopoverBody>{passwordPopoverMsg}</PopoverBody>
                      </UncontrolledPopover>
                          </div>
                          <div className="col-md-auto">
                            <Button 
                            outline 
                            className="btn-round"
                            size="md"
                            onClick={onFireShowPassword}>{(showPasswordButton) ? "Show":"Hide"}
                            </Button>
                          </div>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter 
                    className="text-center">
                    <Button
                      block
                      outline
                      className="btn-round"
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

export default RegisterPublic;