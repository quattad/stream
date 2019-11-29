import React from 'react'
import {Button} from 'reactstrap'

function ProjectsTableButton () {
    return (
    <>
    <div className="float-right">
        <Button outline className="btn-round" size="md" onClick={() => {}}>View All Projects</Button>
    </div>
    <div className="float-right">
        <Button outline className="btn-round" size="md" onClick={() => {}}>Add Project</Button>
    </div> 
    </>
    )
}

export default ProjectsTableButton;