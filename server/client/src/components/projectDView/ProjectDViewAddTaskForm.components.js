import React from "react";
import { UncontrolledAlert, Label, Form, Input, InputGroup, FormGroup } from "reactstrap";
import axios from "axios";

// Import contexts
import { useProjectDViewContext } from './ProjectDViewContext';

// Import child components
import AddUserSearchBar from '../AddUserSearchBar.components';

export function ProjectDViewAddTaskForm(props) {
  const pdvContext = useProjectDViewContext();

  const [taskNameState, setTaskNameState] = React.useState("");
  const [taskDescriptionState, setTaskDescriptionState] = React.useState("");
  const [taskMembersState, setTaskMembersState] = React.useState([]);
  const [taskCreatorState, setTaskCreatorState] = React.useState("");
  const [taskFeatureState, setTaskFeatureState] = React.useState("");
  const [taskStartDateState, setTaskStartDateState] = React.useState();
  const [taskEndDateState, setTaskEndDateState] = React.useState();
  
  // Create state for focus
  const [taskNameFocus, setTaskNameFocus] = React.useState(false);
  const onTaskNameFocus = () => {
    setTaskNameFocus(true)
  };
  const onTaskNameBlur = () => {
    setTaskNameFocus(false)
  };

  const [taskDescriptionFocus, setTaskDescriptionFocus] = React.useState(false);
  const onTaskDescriptionFocus = () => {
    setTaskDescriptionFocus(true)
  };
  const onTaskDescriptionBlur = () => {
    setTaskDescriptionFocus(false)
  };

  // Define form save functions
  const onChangeTaskNameState = (e) => {
    setTaskNameState(e.target.value)
  };
  const onChangeTaskDescriptionState = (e) => {
    setTaskDescriptionState(e.target.value)
  };
  const onChangeTaskFeatureState = (e) => {
    setTaskFeatureState(e.target.value)
  };
  const onChangeTaskStartDateState = (e) => {
    setTaskStartDateState(e.target.value)
  };
  const onChangeTaskEndDateState = (e) => {
    setTaskEndDateState(e.target.value)
  };

  // Define form submission functions
  const onFireReload = () => {
    window.location.reload();
  };
  
  // Create features as options for multiselect field
  const renderedFeatures = (
    () => {
      if (pdvContext.projectData.features && pdvContext.projectData.features.length > 0) {
        let features = pdvContext.projectData.features;
        return features.map(feature => <option key={feature.name} value={feature.name}>{feature.name}</option>);
      };
    }
    )();
  
  React.useEffect(() => {
    // Fetch current user to assign to creator
    setTaskCreatorState(pdvContext.userData.username);

    // Set trigger for POST req to API
    if (props.onFireCreateTask) {
      (async () => { 
        try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/tasks/add/${pdvContext.projectData.name}`, {
            "name": taskNameState,
            "description": taskDescriptionState,
            "members": taskMembersState,
            "startDate": taskStartDateState,
            "endDate": taskEndDateState,
            "featureName": taskFeatureState
          },
          {
            withCredentials: true
          });
      
          if (!res.data.error) {
            onFireReload();
          };
        } catch (err) {
          console.log(err);
        };
      })();
    };
  }, [
    pdvContext.userData.username, 
    props.onFireCreateTask, 
    pdvContext.projectData.name, 
    taskDescriptionState, taskEndDateState, 
    taskFeatureState, 
    taskMembersState, 
    taskNameState, 
    taskStartDateState
  ]);

  return (
    <>
    <UncontrolledAlert 
    isOpen={props.onFireCreateTask} 
    color="info">Task created successfully!</UncontrolledAlert>
    <Form 
    action="" 
    className="form" 
    method="">
      <FormGroup>
        <Label 
        className="float-left">Name</Label>
        <InputGroup 
        className={"no-border input-lg" + (taskNameFocus ?  "input-group-focus" : "")}>
          <Input 
          type="text"
          onChange={onChangeTaskNameState}
          onFocus={onTaskNameFocus}
          onBlur={onTaskNameBlur}></Input>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label 
        className="float-left">Description</Label>
        <InputGroup 
        className={"no-border input-lg" + (taskDescriptionFocus ? " input-group-focus" : "")}>
            <Input 
            type="textarea" 
            onChange={onChangeTaskDescriptionState}
            onFocus={onTaskDescriptionFocus}
            onBlur={onTaskDescriptionBlur}></Input>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label 
        className="float-left" 
        for="membersSelect">Add Members</Label>
        <AddUserSearchBar
        onChangeParentCompUsersState={setTaskMembersState}
        searchBarId={1}
        isOutline={false} />
      </FormGroup>
      <FormGroup>
        <Label 
        className="float-left" 
        for="featureSelect">Feature</Label>
        <Input 
        type="select" 
        name="select" 
        id="featureSelect" 
        onChange={onChangeTaskFeatureState}>
          <option value="">Select Your Feature</option>
          {renderedFeatures}
        </Input> 
      </FormGroup>
      <FormGroup>
        <Label 
        className="float-left" 
        for="startDate">Start Date</Label>
        <Input
          type="date"
          id="startDate"
          placeholder="date placeholder"
          onChange={onChangeTaskStartDateState}></Input>
      </FormGroup>
      <FormGroup>
        <Label 
        className="float-left" 
        for="endDate">End Date</Label>
        <Input
          type="date"
          id="endDate"
          placeholder="date placeholder"
          onChange={onChangeTaskEndDateState}></Input>
      </FormGroup>
      <FormGroup>
        <Label 
        className="float-left" 
        for="creator">Created By</Label>
        <InputGroup>{taskCreatorState}</InputGroup>
      </FormGroup>
      </Form>
    </>
  );
};