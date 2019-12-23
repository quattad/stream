import React from "react";
import {Container} from "reactstrap";

// Import child components
import WelcomeText from "./dashboard/WelcomeText.components"
import ProjectsTable from "./dashboard/ProjectsTable.components"
import TeamTable from "./dashboard/TeamTable.components"
import TransparentFooter from "./TransparentFooter"

// Import services
import {useAuthContext, checkAuth, fetchUserProfile} from "../services/AuthReducer"

export const DashboardContext = React.createContext();
export const useDashboardContext = () => {return React.useContext(DashboardContext)}

function DashboardPrivate() {
  const [userState, setUserState] = React.useState({
    'username':"",
    'firstname':"",
    'lastname':"",
    "position":"",
    "projects":[]
  });

  let pageHeader = React.createRef();
  const auth = useAuthContext();

  React.useEffect(() => {
    checkAuth(auth);
    (async () => {
      const user = await fetchUserProfile(auth);
      setUserState({
        'username': user.username,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'position': user.position,
        'projects': user.projects
      });
    })();

    document.body.classList.add("sidebar-collapse");
    document.body.classList.add("login-page");
    document.documentElement.classList.remove("nav-open");
  }, [auth]);

  return (
    <>
    <DashboardContext.Provider value={{
      userState
    }}>
      <div className="page-header clear-filter" filter-color="blue">
        <div className="page-header-image" 
        style={{
            backgroundImage: "url(" + require("../assets/img/header.jpg") + ")"
            }} ref={pageHeader}></div>
          <Container><WelcomeText></WelcomeText></Container>
          <Container>
            <div className="float-left col-md-6"><ProjectsTable /></div>
            {/* <div className="float-right col-md-6"><TeamTable /></div> */}
          </Container>
          <TransparentFooter />
      </div>
      </DashboardContext.Provider>
    </>
  );
}

export default DashboardPrivate;