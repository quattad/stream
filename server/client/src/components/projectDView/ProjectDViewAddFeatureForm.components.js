import React from "react";
import { Label, Form, Input, InputGroup, FormGroup } from "reactstrap";
import axios from "axios";

import { useProjectDViewContext } from './ProjectDViewContext';

// Import child components
import AddUserSearchBar from '../AddUserSearchBar.components';

export function ProjectDViewAddFeatureForm(props) {
  const pdvContext = useProjectDViewContext();

  const [featureNameState, setFeatureNameState] = React.useState("");
  const [featureDescriptionState, setFeatureDescriptionState] = React.useState("");
  const [featureMembersState, setFeatureMembersState] = React.useState([]);
  const [featureCreatorState, setFeatureCreatorState] = React.useState("");
  
  // Create state for focus
  const [featureNameFocus, setFeatureNameFocus] = React.useState(false);
  const onFeatureNameFocus = () => {setFeatureNameFocus(true)};
  const onFeatureNameBlur = () => {setFeatureNameFocus(false)};

  const [featureDescriptionFocus, setFeatureDescriptionFocus] = React.useState(false);
  const onFeatureDescriptionFocus = () => {setFeatureDescriptionFocus(true)};
  const onFeatureDescriptionBlur = () => {setFeatureDescriptionFocus(false)};

  // Define form save functions
  const onChangeFeatureNameState = (e) => {setFeatureNameState(e.target.value)};
  const onChangeFeatureDescriptionState = (e) => {setFeatureDescriptionState(e.target.value)};

  // Define form submission functions
  const onFireReload = () => {
    window.location.reload();
  };

  React.useEffect(() => {
    // Fetch current user
    setFeatureCreatorState(pdvContext.userData.username);

    if (props.onFireCreateFeature) {
      // IIFE for POST request
      (async () => { 
        try {
          const res = await axios.post(`${process.env.REACT_APP_BASE_SERVER_URL}/features/add/${pdvContext.projectData.name}`, {
            "name": featureNameState,
            "description": featureDescriptionState,
            "members": featureMembersState
          },
          {
            withCredentials: true
          });
          
          if (!res.data.error) {
            onFireReload();
          }
        } catch (err) {
          console.log(err)
        };
      })();

    };

  }, [
    pdvContext.userData.username, 
    props.onFireCreateFeature,
    pdvContext.projectData.name,
    featureNameState,
    featureDescriptionState,
    featureMembersState
  ]);

  return (
    <>
      <Form 
      action="" 
      className="form" 
      method="">
        <FormGroup>
          <Label 
          className="float-left">Name</Label>
          <InputGroup 
          className={"no-border input-sm" + (featureNameFocus ?  "input-group-focus" : "")}>
            <Input 
            type="text"
            onChange={onChangeFeatureNameState}
            onFocus={onFeatureNameFocus}
            onBlur={onFeatureNameBlur}></Input>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label 
          className="float-left">Description</Label>
          <InputGroup 
          className={"no-border input-sm" + (featureDescriptionFocus ? " input-group-focus" : "")}>
              <Input 
              type="textarea" 
              onChange={onChangeFeatureDescriptionState}
              onFocus={onFeatureDescriptionFocus}
              onBlur={onFeatureDescriptionBlur}></Input>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label 
          className="float-left">Add Members</Label>
          <AddUserSearchBar
          onChangeParentCompUsersState={setFeatureMembersState}
          searchBarId={1}
          isOutline={false} />
        </FormGroup>
        <FormGroup>
          <Label className="float-left" for="creator">Created By</Label>
          <br /><InputGroup id="creator">{featureCreatorState}</InputGroup>
        </FormGroup>
        </Form>
    </>
  );
}