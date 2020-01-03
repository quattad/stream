import React from "react";
import ProjectSpinner from "../ProjectSpinner.components";
import { useDashboardContext } from "../DashboardPrivate.components";

function WelcomeText () {
    const dbContext = useDashboardContext();
    const [firstName,setFirstName] = React.useState("");
    
    React.useEffect(() => {
        setFirstName(dbContext.userState.firstname);
    }, [dbContext.userState.firstname]);
    return (
    <>
    <div className="float-left">
        <h1>Welcome, {firstName ? firstName : <ProjectSpinner />} {dbContext.userState.lastname ? dbContext.userState.lastname : <ProjectSpinner />}</h1>
    </div> 
    </>
    )
}

export default WelcomeText;