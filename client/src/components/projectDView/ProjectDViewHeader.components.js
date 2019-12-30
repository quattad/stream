import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import ProjectDViewText from './ProjectDViewHeaderText.components';
import ProjectDViewButtons from './ProjectDViewHeaderButtons.components';
// import ProjectDViewDropdown from './ProjectDViewHeaderDropdown.components';

// Import context
import {useProjectDViewContext} from './ProjectDViewContext';

function ProjectDViewHeader() {
    let pdvContext = useProjectDViewContext();

    return(
        <>
        <Row>
            <Col>
            <Container>
                <ProjectDViewText pdvContext={pdvContext}  />
            </Container>
            </Col>
            <Col>
            <Container>
                {/* Uncomment when other views are functioning */}
                {/* <Col className="float-left"><ProjectDViewDropdown pdvContext={pdvContext}/></Col> */}
                <Col className="float-right"><ProjectDViewButtons /></Col> 
            </Container>
            </Col>
        </Row>
        </>
    )
}

export default ProjectDViewHeader;