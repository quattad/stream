import React from 'react'

// reactstrap components./ProjectsTableHeader.components
import { Container } from "reactstrap";

import ProjectsTableHeader from "./ProjectsTableHeader.components";
import ProjectsTableButton from "./ProjectsTableButton.components";
import ProjectsTableRow from "./ProjectsTableRow.components";
import ProjectSpinner from "../ProjectSpinner.components";

import { useDashboardContext } from "../DashboardPrivate.components"

function ProjectsTable () {
    const dbContext = useDashboardContext();
    
    const renderedProjects = (() => {
        if (dbContext.userState.projects && dbContext.userState.projects.length > 0) {
            let projects = dbContext.userState.projects
            
            return projects.map(project =>
            <div className="row" key={project}>
                <Container key={project}><ProjectsTableRow key={project} project={project} /></Container>
            </div>
            )
        } else if (dbContext.userState.projects && dbContext.userState.projects.length < 1) {
            return <p>You currently have no projects.</p>
        }
        else {
            return <ProjectSpinner />
        }
    })();

    return (
    <>
    <div className="row">
        <Container>
            <div className="float-left"><ProjectsTableHeader /></div>
            <div className="float-right"><ProjectsTableButton /></div>
        </Container>
    </div>
    {renderedProjects ? renderedProjects : <ProjectSpinner />}
    </>
    )
}

export default ProjectsTable;