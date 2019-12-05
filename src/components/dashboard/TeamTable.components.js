import React from 'react'
import {Container} from "reactstrap";

import TeamTableHeader from './TeamTableHeader.components'
import TeamTableButton from "./TeamTableButton.components"
import TeamTableRow from "./TeamTableButton.components"

function TeamTable () {
    return (
    <>
    <Container>
        <div className="col-md-12"><TeamTableHeader /></div>
        <div className="col-md-12"><TeamTableButton /></div>
    </Container>
    </>
    )
}

export default TeamTable;