import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function ProjectDViewHeaderDropdown(props) {
    // FUNCTIONAL HOOKS
    const [dropDownState, setDropDownState] = React.useState(false);
    const onFireDropDown = () => {setDropDownState(!dropDownState)};
    
    return (
        <>
        <Dropdown style={{width:"100%"}} isOpen={dropDownState} toggle={onFireDropDown} >
            <DropdownToggle outline className="btn-round btn-block" caret>Change Display</DropdownToggle>
            <DropdownMenu right>
            <DropdownItem onClick={props.pdvContext.renderProjectDashboard}><div>Project Dashboard</div></DropdownItem>
                <DropdownItem onClick={props.pdvContext.renderDiagramGantt}><div>Gantt Chart</div></DropdownItem>
                <DropdownItem onClick={props.pdvContext.renderDiagramRaci}><div>RACI Matrix</div></DropdownItem>
            </DropdownMenu>
        </Dropdown>
        </>
    )
}

export default ProjectDViewHeaderDropdown;