import React from "react";
import { Container } from "reactstrap";

import TransparentFooter from './TransparentFooter'

const About = () => {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    document.body.classList.add("sidebar-collapse");
    document.body.classList.add("login-page");
    document.documentElement.classList.remove("nav-open")

    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform = "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
      };
    };
  });

  return (
    <>
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
                  <h1>About Page</h1>
              </Container>
          </div>
          <TransparentFooter />
      </div>
    </>
  );
}

export default About;