import React from 'react';

import {ajaxPost} from './ajax.js';
import Status from './status.js';
import StatusDropdown from './status_dropdown.js';

class TaskEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'name': '', 'notes': '', 'status': Status.NOT_STARTED, 'is_planned': true};

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleIsPlannedChange = this.handleIsPlannedChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextChange(fieldName, event)
    {
        const newState = {};
        newState[fieldName] = event.target.value;
        this.setState(newState);
    }
    handleIsPlannedChange(event)
    {
        this.setState({'is_planned': event.target.checked});
    }
    
    // TODO: allow enter to submit when fields (besides notes) are focused.
    // TODO: validation for empty name on submit
    handleSubmit()
    {
        ajaxPost('/task', {
            'date': this.props.date,
            'name': this.state.name,
            'is_planned': this.state.is_planned,
            'status': this.state.status,
            'notes': this.state.notes
        }).done(() => {
            this.setState({'name': '', 'notes': ''});
            this.props.onTaskEntrySuccessful();
        });
    }

    // TODO: if I use this for modal, do the incrementing static ID for all children with labels
    // TODO: select is duplicated with task_view.js, can I easily extract into component?
    render()
    {
        return (
            <div>
                <h3>Task Entry</h3>
                <TextInput label='Name' value={this.state.name} 
                    onChange={(e) => this.handleTextChange('name', e)}/>
                <TextInput label='Notes' isMultiLine value={this.state.notes}
                    onChange={(e) => this.handleTextChange('notes', e)}/>
                <div className="entry-single-row-field">
                    <label htmlFor="entry-status">Status</label>
                    <StatusDropdown id="entry-status" status={this.state.status} 
                        onStatusChange={(status) => this.setState({'status': status})} />
                </div>
                <div className="entry-single-row-field">
                    <label htmlFor="entry-is-planned">Is Planned</label>
                    <input type="checkbox" id="entry-is-planned" checked={this.state.is_planned} 
                        onChange={this.handleIsPlannedChange}/>
                </div>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}

class TextInput extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        // TODO: I've got no clue if this ID will be unique. Could do a static incrementing id 
        let entryId = `entry-${this.props.label}`;
        let textInputElement = (this.props.isMultiLine === undefined) ?
            <input type="text" id={entryId} onChange={this.props.onChange} value={this.props.value} /> : 
            <textarea id={entryId} onChange={this.props.onChange} value={this.props.value}
                className="entry-textarea" />;
        return (
            <div className="entry-multi-row-field">
                <label htmlFor={entryId}>{this.props.label}</label>
                {textInputElement}
            </div>
        );
    }
}

export default TaskEntryForm;
