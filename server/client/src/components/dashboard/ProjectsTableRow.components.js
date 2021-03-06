import React from 'react'
import { Link } from 'react-router-dom'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import axios from 'axios'

const ProjectsTableRow = (props) => {
    const [deleteModalState, setDeleteModalState] = React.useState(false);
    const onChangeDeleteButton = () => {setDeleteModalState(!deleteModalState)};

    const onFireReload = () => {
        window.location.reload();
    };

    const projectDViewUri = `/projects/${props.project}`;
    // const editProjectUri = `/editproject/${props.project}`;

    const onDeleteProject = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/projects/delete`,
            {
                "name": props.project
            },
            {
                withCredentials: true
            });
            
            if (!res.data.error) {
                onChangeDeleteButton();
                onFireReload();
            }
        } catch (err) {
            // Add Alert here
            onFireReload();
        }
    };
    return (
    <>
    <div 
    className="float-left">
        <h4>{props.project}</h4>
    </div> 
    <div 
    className="float-right" 
    style={{paddingTop:"20px"}}>
        <Link 
        to={projectDViewUri}>
            <Button 
            outline 
            className="btn-round" 
            size="md">View</Button>
        </Link>
        {/* Commented out until EditProject and AddUserSearchBar are active */}
        {/* <Link 
        to={editProjectUri}>
            <Button 
            outline 
            className="btn-round" 
            size="md">Edit</Button>
        </Link> */}
        <Button 
        outline 
        className="btn-round" 
        size="md" 
        onClick={onChangeDeleteButton}>Delete</Button>
        <Modal 
        isOpen={deleteModalState} 
        toggle={onChangeDeleteButton}>
            <ModalHeader 
            toggle={onChangeDeleteButton}>Delete Project</ModalHeader>
            <ModalBody>Are you sure you would like to delete this project?</ModalBody>
            <ModalFooter>
                <Button 
                color="primary" 
                onClick={onDeleteProject}>Yes</Button>
                <Button 
                color="secondary" 
                onClick={onChangeDeleteButton}>No</Button>
            </ModalFooter>
        </Modal>
    </div>  
    </>
    )
}

export default ProjectsTableRow;