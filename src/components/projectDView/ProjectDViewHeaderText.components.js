import React from 'react';
import { Container, Col, Row } from 'reactstrap';

function ProjectDViewHeaderText(props) {
    return(
        <>
        <Container>
            <Col>
            <Row><h2>{props.pdvContext.projectData.name}</h2></Row>
            <Row><h5>{props.pdvContext.projectData.description}</h5></Row>
            </Col>
        </Container>
        </>
    )
}

export default ProjectDViewHeaderText;