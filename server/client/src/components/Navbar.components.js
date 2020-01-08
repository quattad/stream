import React from "react";
import {Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container} from "reactstrap";

// Import child components
import NavbarProfile from "./dashboard/Navbar.Profile.components"

// Import authContext
import {useAuthContext, fetchUserProfile} from "../services/AuthReducer"

// Create Navbar context for child components
export const NavbarContext = React.createContext();
export const useNavbarContext = () => {return React.useContext(NavbarContext)}

// Logo var
const navbarLogoPath = require("./../assets/img/stream-logo-white-text.png");

function IndexNavbar () {
  const auth = useAuthContext(); 
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  // Set user state for Navbar
  const [userState, setUserState] = React.useState({
    'username':"",
  })

  React.useEffect(() => {
    // Fetch username of currently logged in user
    (async () => {
      if (auth.state.isAuthenticated) {
        const user = await fetchUserProfile(auth);
        setUserState({'username':user.username})
      }
    })();

    const updateNavbarColor = () => {
      if (document.documentElement.scrollTop > 399 || document.body.scrollTop > 399) {
        setNavbarColor("");
      } else if (document.documentElement.scrollTop < 400 || document.body.scrollTop < 400) {
        setNavbarColor("navbar-transparent");
      }};
      
      window.addEventListener("scroll", updateNavbarColor);
      return function cleanup() {
        window.removeEventListener("scroll", updateNavbarColor);
    };

  }, [auth]);

  return (
    <>
    <NavbarContext.Provider value ={{userState}}>
      {collapseOpen ? (<div id="bodyClick" onClick={() => {
        document.documentElement.classList.toggle("nav-open");
        setCollapseOpen(false);
      }}/>) : null}
        <Navbar className={"navbar-dark fixed-top " + navbarColor} expand="lg" color="info">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand href={auth.state.isAuthenticated ? ("/dashboard") : ("/")} id="navbar-brand"><img alt="logo" src={navbarLogoPath} style={{width: "20%", height:"20%"}} /></NavbarBrand>
            <button className="navbar-toggler navbar-toggler-icon" onClick={() => {
              document.documentElement.classList.toggle("nav-open"); 
              setCollapseOpen(!collapseOpen);
            }} aria-expanded={collapseOpen} type="button"></button>
          </div>
          <Collapse className="justify-content-end" isOpen={collapseOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="/about" hidden={auth.state.isAuthenticated}><p>About</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/" hidden={!auth.state.isAuthenticated}><p>Dashboard</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/register" hidden={auth.state.isAuthenticated}><p>Register</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login" hidden={auth.state.isAuthenticated}><p>Login</p></NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink href="/projects" hidden={!auth.state.isAuthenticated}><p>Projects</p></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/teams" hidden={!auth.state.isAuthenticated}><p>Teams</p></NavLink>
              </NavItem> */}
              <NavItem>
                <NavbarProfile></NavbarProfile>
              </NavItem>
              </Nav>
          </Collapse>
        </Container>
      </Navbar>
      </NavbarContext.Provider>
    </>
  );
}

export default IndexNavbar;
