import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import ProjectSpinner from "../ProjectSpinner.components";

function ProjectDViewHeaderText(props) {
    return(
        <>
        <Container>
            <Col>
            <Row><h2>{props.pdvContext.projectData.name ? props.pdvContext.projectData.name : <ProjectSpinner />}</h2></Row>
            <Row><h5>{props.pdvContext.projectData.description ? props.pdvContext.projectData.description : <ProjectSpinner />}</h5></Row>
            </Col>
        </Container>
        </>
    )
}

export default ProjectDViewHeaderText;