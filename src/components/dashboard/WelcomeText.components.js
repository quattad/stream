import React from 'react'
import {useDashboardContext} from "../DashboardPrivate.components" 

function WelcomeText () {
    const dbContext = useDashboardContext()
    return (
    <>
    <div className="float-left">
        <h1>Welcome, {dbContext.userState.firstname} {dbContext.userState.lastname}</h1>
    </div> 
    </>
    )
}

export default WelcomeText;