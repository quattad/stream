import React from 'react';
import { Redirect } from 'react-router';
import { Button, Container, Card, CardFooter, Form, Col } from 'reactstrap';

// Import child components
import TransparentFooter from './TransparentFooter'

// Import services
import { useAuthContext } from "../services/AuthReducer"

const HomePublic = () => {
  const auth = useAuthContext();
  let pageHeader = React.createRef();

  React.useEffect(() => {
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
  });

  return (
    <>
    {auth.state.isAuthenticated && <Redirect to='/dashboard'> push={true} </Redirect>}
      <div 
      className="page-header clear-filter" 
      filter-color="blue">
        <div 
        className="page-header-image" 
        style={{backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"}} 
        ref={pageHeader}></div>
          <div 
          className="content-center brand">
            <Container>
              <h1 
              className="h1-seo">Execute your projects better.</h1>
            <h3>Stream allows your team to better organize your people for optimum resource allocation.</h3>
            </Container>
            <br />
            <Container>
            <Col 
            className="ml-auto mr-auto" 
            md="4">
              <Card 
              className="card-login card-plain">
                <Form 
                action="" 
                className="form" 
                method="">
                  <CardFooter 
                  className="text-center">
                    <Button
                    href="/register"
                    block
                    className="btn-neutral btn-round"
                    color="info"
                    onClick={()=> "window.location='./register'"}
                    size="lg"
                    >Get Started</Button>
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

export default HomePublic;