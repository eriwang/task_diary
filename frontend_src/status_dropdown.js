import React from 'react';

import Status from './status.js';

class StatusDropdown extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <select id={this.props.id} value={this.props.status} 
                onChange={(event) => this.props.onStatusChange(parseInt(event.target.value))}>
                <option value={Status.NOT_STARTED}>Not Started</option>
                <option value={Status.IN_PROGRESS}>In Progress</option>
                <option value={Status.COMPLETE}>Complete</option>
                <option value={Status.DROPPED}>Dropped</option>
            </select>
        );
    }
}

export default StatusDropdown;
