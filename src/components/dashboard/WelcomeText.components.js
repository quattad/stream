import React from "react";
import ProjectSpinner from "../ProjectSpinner.components";
import { useDashboardContext } from "../DashboardPrivate.components";

function WelcomeText () {
    const dbContext = useDashboardContext()
    return (
    <>
    <div className="float-left">
        <h1>Welcome, {dbContext.userState.firstname ? dbContext.userState.firstname : <ProjectSpinner />} {dbContext.userState.lastname ? dbContext.userState.lastname : <ProjectSpinner />}</h1>
    </div> 
    </>
    )
}

export default WelcomeText;