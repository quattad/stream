import React from 'react'
import {Button} from 'reactstrap'

function ProjectsTableRow (props) {
    return (
    <>
    <div className="float-left">
        <h4>{props.project}</h4>
    </div> 
    <div className="float-right" style={{paddingTop:"20px"}}>
        <Button outline className="btn-round" size="md" onClick={() => {}}>View</Button>
    </div>  
    </>
    )
}

export default ProjectsTableRow;