import React from 'react'
import { Redirect } from 'react-router'

import { Button } from 'reactstrap'

const ProjectsTableButton = () => {
    const [fireRedirectAddProject, setFireRedirectAddProject] = React.useState(false);

    const onFireRedirectAddProject = () => {
        setFireRedirectAddProject(!fireRedirectAddProject);
    };

    return (
    <>
    {fireRedirectAddProject && <Redirect to="/addproject"></Redirect>}
    <div className="float-right">
        <Button 
        outline 
        className="btn-round" 
        size="md" 
        onClick={onFireRedirectAddProject}>Add Project</Button>
    </div> 
    </>
    )
};

export default ProjectsTableButton;