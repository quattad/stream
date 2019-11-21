import React from "react";
import {Redirect} from "react-router"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
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
import axios from "axios";

// authentication
import {createCookie, readCookie, deleteCookie} from "../services/Auth"

// import useAuth functions to set authState
import {useAuth} from "../services/Auth"

function LoginPage() {

  // Create state to store entered username and pw
  const [usernameState, setUsernameState] = React.useState("");
  const [passwordState, setPasswordState] = React.useState("");
  
  const [usernameFocus, setUsernameFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);

  // Define form save functions
  const onChangeUsername = (e) => {
    setUsernameState(e.target.value)
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
  const[fireRedirect, setFireRedirect] = React.useState(false)
  const[showPassword, setShowPassword] = React.useState("password")
  const[showPasswordButton, setShowPasswordButton] = React.useState("Show")

  const onFireRedirect = (e) => {
    setFireRedirect(true)
  }

  // Define login function
  // TODO - authentication function in backend
  const onSubmitLogin = (e) => {
    axios.post('http://localhost:5000/login', {
      "username": usernameState,
      "password": passwordState
    })
      .then(res => {
        if (!res.data.error) {
          // console.log("User" + usernameState + "successfully logged in with pw" + passwordState);
          onFireRedirect(e)
        }
      })
      .catch(err => {
        console.log("Error: " + err)
      })
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
      {fireRedirect && <Redirect to='/login'> push={true} </Redirect>}
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
                  <h3 
                    className="h3 seo">
                      Welcome back to Stream.
                  </h3>
                  </Container>
                  <CardBody>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (usernameFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Username"
                        type="text"
                        onChange={(e)=>onChangeUsername(e)}
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
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
                      <Button 
                        outline 
                        className="btn-round"
                        size="md"
                        onClick={() => {
                          createCookie()
                        }}>
                          Create Cookie
                      </Button>
                      <Button 
                        outline 
                        className="btn-round"
                        size="md"
                        onClick={() => {
                          readCookie()
                        }}>
                          Read Cookie
                      </Button>
                      <Button 
                        outline 
                        className="btn-round"
                        size="md"
                        onClick={() => {
                          deleteCookie()
                        }}>
                          Delete Cookie
                      </Button>
                    </div>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                      block
                      className="btn-round"
                      color="info"
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
                      onClick={() => "window.location='/register'"}
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