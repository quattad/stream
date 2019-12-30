import React from 'react'
// import {Redirect} from 'react-router'

import {Button} from 'reactstrap'

function ProjectsTableButton () {
    const [fireRedirectAddProject, setFireRedirectAddProject] = React.useState(false)

    return (
    <>
    {/* {fireRedirectAddProject && <Redirect to="/projects/add"></Redirect>} */}
    <div className="float-right">
        <Button outline className="btn-round" size="md" onClick={() => {}}>View All Teams</Button>
    </div>
    <div className="float-right">
        <Button outline className="btn-round" size="md">Add Member To Team</Button>
    </div> 
    </>
    )
}

export default ProjectsTableButton;