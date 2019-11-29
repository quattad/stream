import React from "react";
import {Redirect} from "react-router"

// reactstrap components
import {Button,Card,CardBody,CardFooter,Form,Input,InputGroupAddon,InputGroupText,InputGroup,Container,Col
} from "reactstrap";

// core components
import Navbar from "./Navbar.components";
import TransparentFooter from "./TransparentFooter";
import axios from "axios";

// import useAuth functions to set authState
import {useAuthContext} from '../services/AuthReducer'

function LoginPage() {

  // Hook to fetch state object passed down from parent App component
  // This is run everytime there is a change in SPA e.g. change in form field
  const auth = useAuthContext()

  // Create state to store entered username and pw
  const [emailState, setEmailState] = React.useState("");
  const [passwordState, setPasswordState] = React.useState("");
  
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);

  // Define form save functions
  const onChangeEmail = (e) => {
    setEmailState(e.target.value)
  };
  const onChangePassword = (e) => {
    setPasswordState(e.target.value)
  };
  const onShowPassword = (e) => {
    setShowPassword(!showPassword)
  };
  const onShowPasswordButton = (e) => {
    setShowPasswordButton(!showPasswordButton)
  };

  // Additional form features
  const[fireRedirectHome, setFireRedirectHome] = React.useState(false)
  const[fireRedirectRegister, setFireRedirectRegister] = React.useState(false)
  const[showPassword, setShowPassword] = React.useState("password")
  const[showPasswordButton, setShowPasswordButton] = React.useState("Show")

  const onFireRedirectHome = (e) => {
    setFireRedirectHome(true)
  }

  const onFireRedirectRegister = (e) => {
    setFireRedirectRegister(true)
  }

  // Define login function
  const onSubmitLogin = async (e) => {
    try {
      const res = await axios.post('http://localhost:5000/users/login', {
        "email": emailState,
        "password": passwordState
      },
      {
        withCredentials: true
      });

      if (!res.data.error) {
        auth.handleLogin();
        onFireRedirectHome(e);

    }} catch (err) {
    /** Error handling for login issues */
    if (err.response.data.description === "EMAIL_FIELD_EMPTY") {}
    else if (err.response.data.description === "PASSWORD_FIELD_EMPTY") {}
    else if (err.response.data.description === "USER_NOT_FOUND") {}
    else if (err.response.data.description === "PASSWORD_DOES_NOT_MATCH") {}
    else {throw new Error("Uncaught ")}
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
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("../assets/img/login.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form action="" className="form" method="">
                  <Container>
                    <h3 className="h3 seo">Welcome back to Stream.</h3>
                  </Container>
                  <CardBody>
                    <InputGroup
                      className={
                        "no-border input-lg" + (emailFocus ? " input-group-focus" : "")
                      }>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="text"
                        onChange={(e)=>onChangeEmail(e)}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (passwordFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_lock-circle-open"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type={(showPassword ? "password": "text")}
                        onChange={(e)=>onChangePassword(e)}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                      ></Input>
                    </InputGroup>
                    <div className="col-md-auto">
                      <Button 
                        outline 
                        className="btn-round"
                        size="md"
                        onClick={(e) => {
                          onShowPassword(e)
                          onShowPasswordButton(e)
                        }}>
                          {(showPasswordButton) ? "Show Password":"Hide Password"}
                      </Button>
                    </div>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                      outline
                      block
                      className="btn-round"
                      onClick={(e) => {
                        onSubmitLogin(e)
                      }}
                      size="lg"
                    >
                      Login
                    </Button>
                    <div className="pull-left">
                      <h6>
                      <a
                      className="link"
                      href="/register"
                      onClick={() => onFireRedirectRegister()}
                      >
                        Register
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