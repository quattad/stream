/*eslint-disable*/
import React from "react";

// reactstrap components
import {
    Button,
    Container,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col
} from "reactstrap";

import TransparentFooter from './TransparentFooter'

function IndexHeader() {
  let pageHeader = React.createRef();

  const [firstFocus, setFirstFocus] = React.useState(false);

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
      <div className="page-header clear-filter" filter-color="blue">
        <div className="page-header-image" 
        style={{
            backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"
            }} ref={pageHeader}></div>
          <div className="content-center brand">
            <Container>
            <h1 className="h1-seo">Execute your projects better.</h1>
            <h3>Stream allows your team to better organize your people for optimum resource allocation.</h3>
            </Container>
            <br />
            <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form action="" className="form" method="">
                  <CardFooter className="text-center">
                    <Button
                      href="/register"
                      block
                      className="btn-neutral btn-round"
                      color="info"
                      onClick={()=> "window.location='./register'"}
                      size="lg"
                    >
                      Get Started
                    </Button>
                    <div className="pull-center">
                      <h6>
                        <a
                          className="link"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Need help?
                        </a>
                      </h6>
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

export default IndexHeader;