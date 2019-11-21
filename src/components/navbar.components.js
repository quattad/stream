import React from "react";

// reactstrap components
import {Collapse, NavbarBrand,Navbar, NavItem, NavLink, Nav, Container} from "reactstrap";

// Import auth object
import {useAuthContext} from "../services/AuthReducer"

function IndexNavbar() {
  const auth = useAuthContext(); 
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  // useEffect hook tells React that component needs to do something after render; 
  // remembers fn and executes it after DOM updates; By default will run after every render
  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 399 ||
        document.body.scrollTop > 399
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 400 ||
        document.body.scrollTop < 400
      ) {
        setNavbarColor("navbar-transparent");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });
  return (
    <>
      {collapseOpen ? 
      (<div id="bodyClick" onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}/>) 
          : null}
      <Navbar 
      className={"navbar-dark fixed-top " + 
      navbarColor} 
      expand="lg" 
      color="info">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand 
            href={auth.state.isAuthenticated ? ("/home") : ("/")} 
            id="navbar-brand">
              Stream
            </NavbarBrand>
            <button className="navbar-toggler navbar-toggler-icon" onClick={() => {document.documentElement.classList.toggle("nav-open"); setCollapseOpen(!collapseOpen);}}
            aria-expanded={collapseOpen}
            type="button">
            </button>
          </div>
          <Collapse className="justify-content-end" isOpen={collapseOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="/about"><p>About</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/register" hidden={auth.state.isAuthenticated}><p>Register</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login" hidden={auth.state.isAuthenticated}><p>Login</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => auth.handleLogout()} hidden={!auth.state.isAuthenticated}><p>Logout</p></NavLink>
              </NavItem>
              </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default IndexNavbar;
