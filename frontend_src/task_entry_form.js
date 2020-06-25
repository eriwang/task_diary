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
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleIsPlannedChange = this.handleIsPlannedChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextChange(fieldName, event)
    {
        const newState = {};
        newState[fieldName] = event.target.value;
        this.setState(newState);
    }

    handleStatusChange(status)
    {
        this.setState({'status': status});
    }

    handleIsPlannedChange(is_planned)
    {
        this.setState({'is_planned': is_planned});
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

    render()
    {
        return (
            <div>
                <h3>Task Entry</h3>
                <TextInput label='Name' value={this.state.name} onChange={(e) => this.handleTextChange('name', e)}/>
                <TextInput label='Notes' value={this.state.notes} onChange={(e) => this.handleTextChange('notes', e)}
                    isMultiLine />
                <StatusInput status={this.state.status} onStatusChange={this.handleStatusChange} />
                <CheckboxInput label="Is Planned" checked={this.state.is_planned}
                    onCheckedChange={this.handleIsPlannedChange} />
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
        this.instanceId = TextInput.id++;
    }

    render()
    {
        const elementId = `entry-text-input-${this.instanceId}`;
        let textInputElement = (this.props.isMultiLine === undefined) ?
            <input type="text" id={elementId} onChange={this.props.onChange} value={this.props.value} /> : 
            <textarea id={elementId} onChange={this.props.onChange} value={this.props.value}
                className="entry-textarea" />;
        return (
            <div className="entry-multi-row-field">
                <label htmlFor={elementId}>{this.props.label}</label>
                {textInputElement}
            </div>
        );
    }
}
TextInput.id = 0;  // static

class StatusInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.instanceId = StatusInput.id++;
    }

    render()
    {
        const elementId = `entry-status-input-${this.instanceId}`;
        return (
            <div className="entry-single-row-field">
                <label htmlFor={elementId}>Status</label>
                <StatusDropdown id={elementId} status={this.props.status} onStatusChange={this.props.onStatusChange} />
            </div>
        );
    }
}
StatusInput.id = 0; // static

class CheckboxInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.instanceId = CheckboxInput.id++;
    }

    render()
    {
        const elementId = `entry-checkbox-input-${this.instanceId}`;
        return (
            <div className="entry-single-row-field">
                <label htmlFor={elementId}>{this.props.label}</label>
                <input type="checkbox" id={elementId} checked={this.props.checked} 
                    onChange={(e) => this.props.onCheckedChange(e.target.checked)}/>
            </div>
        );
    }
}
CheckboxInput.id = 0; // static

export default TaskEntryForm;
