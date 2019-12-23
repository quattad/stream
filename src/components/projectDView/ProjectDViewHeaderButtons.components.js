import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import { ProjectDViewAddFeatureForm } from './ProjectDViewAddFeatureForm.components';
import { ProjectDViewAddTaskForm } from './ProjectDViewAddTaskForm.components';

function ProjectDViewHeaderButtons() {
    const [showAddFeatureModal, setShowAddFeatureModal] = React.useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);

    const [onFireCreateFeature, setOnFireCreateFeature] = React.useState(false);
    const [onFireCreateTask, setOnFireCreateTask] = React.useState(false);

    const toggleAddFeatureModal = () => {
        setShowAddFeatureModal(!showAddFeatureModal)
    };
    const toggleAddTaskModal = () => {
        setShowAddTaskModal(!showAddTaskModal)
    };

    const onChangeCreateFeatureButton = () => {
        setOnFireCreateFeature(true)
    };
    const onChangeCreateTaskButton = () => {
        setOnFireCreateTask(true)
    };

    const [dropDownState, setDropDownState] = React.useState(false)
    const onFireDropDown = () => {setDropDownState(!dropDownState)}

    return (
        <>
        <Row>
            <Col xs="4" />
            <Col xs="4" />
            <Col xs="4">
                <Dropdown isOpen={dropDownState} toggle={onFireDropDown}>
                    <DropdownToggle caret outline className="btn-dropdown btn-round">
                        New
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem onClick = {toggleAddFeatureModal}>Feature</DropdownItem>
                        <DropdownItem onClick = {toggleAddTaskModal}>Task</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Modal isOpen={showAddFeatureModal} toggle={toggleAddFeatureModal}>
                    <ModalHeader>Add Feature</ModalHeader>
                    <ModalBody>
                        <ProjectDViewAddFeatureForm onFireCreateFeature={onFireCreateFeature}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-info" onClick={onChangeCreateFeatureButton}>Create Feature</Button>
                        <Button className="btn-secondary" onClick={toggleAddFeatureModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={showAddTaskModal} toggle={toggleAddTaskModal}>
                <ModalHeader>Add Task</ModalHeader>
                <ModalBody>
                    <ProjectDViewAddTaskForm onFireCreateTask={onFireCreateTask}/>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-info" onClick={onChangeCreateTaskButton}>Create Task</Button>
                    <Button className="btn-secondary" onClick={toggleAddTaskModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            </Col>
      </Row>
      </>
    )
}

export default ProjectDViewHeaderButtons;