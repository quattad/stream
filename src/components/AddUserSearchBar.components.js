import React from "react";
import { UncontrolledPopover, PopoverBody, InputGroup, Col, Row, Button, Input, Container } from "reactstrap";
import axios from 'axios';

/**
 * Custom user search bar that takes in username as input and checks with MongoDB index whether username exists
 * If exists, adds it to parent component state
 * Must pass down the following props from parent component
 * 
 * onChangeParentCompUsersState 
 * - parent component setState method for array of usernames to be saved (e.g. members/admins for project, members for task);
 * - pass in renderedMembers as argument to ensure usernames state in searchbar component is matched with parent compoonent at the end of every render
 * (via useEffect)
 * 
 * searchBarId 
 * - to allow error messages (shown via popovers) to be shown to the correct input text field
 */

const AddUserSearchBar = (props) => {
    const [renderedMembers, setRenderedMembers] = React.useState([]);
    const [usernameInput, setUsernameInput] = React.useState("");

    const [searchBarFocus, setSearchBarFocus] = React.useState(false);
    const [showUsernameInputPopover, setShowUsernameInputPopover] = React.useState(false);
    const [usernameInputPopoverMsg, setUsernameInputPopoverMsg] = React.useState("");

    const addUserToRenderedMembers = async () => {
        if (!renderedMembers.includes(usernameInput)) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/users/search-mongo`,
                {
                    value: usernameInput
                },
                {
                    withCredentials: true
                });

                if (res.data.usernames.length > 0) {
                    pushElement();
                    setShowUsernameInputPopover(!showUsernameInputPopover);
                    setUsernameInputPopoverMsg("Username " + `${usernameInput}` +" added.");
                };

            } catch (err) {
                if (err.response.data.description === "NO_USERS_FOUND") {
                    setShowUsernameInputPopover(!showUsernameInputPopover);
                    setUsernameInputPopoverMsg("Username " + `${usernameInput}` + " does not exist.");
                } else {
                    console.log(err)
                }
            }
        } else {
            setShowUsernameInputPopover(!showUsernameInputPopover);
            setUsernameInputPopoverMsg("Username already added.");
        };
    };

    const pushElement = () => {
        let newRenderedMembers = renderedMembers;
        newRenderedMembers.push(usernameInput);
        setRenderedMembers(newRenderedMembers);
        clearUsernameInput();
    };

    const popElement = (el) => {
        let newRenderedMembers = renderedMembers;
        setRenderedMembers(newRenderedMembers.filter(member => {
            return member !== el;
        }));
        setShowUsernameInputPopover(!showUsernameInputPopover);
        setUsernameInputPopoverMsg("Username " + el +" removed.");
        clearUsernameInput();
    };

    const onChangeUsernameInput = (e) => {
        setUsernameInput(e.target.value);
    };

    const clearUsernameInput = () => {
        setUsernameInput("");
    };

    const onSearchBarFocus = () => {
        setSearchBarFocus(!searchBarFocus);
    };

    const onToggleUsernameInputPopover = () => {
        setShowUsernameInputPopover(false);
    };

    React.useEffect(() => {
        props.onChangeParentCompUsersState(renderedMembers)
    }, [props, renderedMembers]);

    return (
        <>
        <InputGroup 
        className={"no-border input-lg" + (searchBarFocus ?  "input-group-focus" : "")}>
        <Container>
            <Row>
                <Col 
                className="d-flex align-items-center">
                    <Input
                    id={"addMembersField" + props.searchBarId}
                    onChange={onChangeUsernameInput}
                    onFocus={onSearchBarFocus}
                    type="text"
                    placeholder={usernameInput}
                    value={usernameInput}></Input>
                </Col>
                <UncontrolledPopover 
                trigger="click" 
                toggle={onToggleUsernameInputPopover}
                placement="right" 
                isOpen={showUsernameInputPopover} 
                target={"addMembersField" + props.searchBarId}>
                <PopoverBody>{usernameInputPopoverMsg}</PopoverBody>
                </UncontrolledPopover>
                <Col xs="3">
                    <Button
                    outline
                    block
                    className="btn-round"
                    onClick={addUserToRenderedMembers}>Add</Button>
                </Col>
            </Row>
            <Row>
                {renderedMembers.map(el => (
                <Col 
                key={el}>
                    <Button
                    key={el} 
                    outline 
                    onClick={()=> {popElement(el)}} 
                    >{el} <i className="now-ui-icons ui-1_simple-remove" />
                    </Button>
                </Col>
                ))}
            </Row>
        </Container>
        </InputGroup>
        </>
    )
};

export default AddUserSearchBar;