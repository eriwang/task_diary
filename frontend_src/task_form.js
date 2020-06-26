import React from 'react';

import {TextInput, StatusInput, CheckboxInput} from './form_components.js';

// TODO: allow enter to submit when fields (besides notes) are focused
// TODO: validation for empty name on submit
export default class TaskForm extends React.Component
{
    constructor(props)
    {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit()
    {
        this.props.onSubmitTask({
            'id': this.props.id,
            'date': this.props.date,
            'name': this.props.name,
            'is_planned': this.props.is_planned,
            'status': this.props.status,
            'notes': this.props.notes
        });
    }

    render()
    {
        return (
            <div>
                <TextInput label='Name' value={this.props.name} 
                    onChange={(e) => this.props.onFieldChange('name', e.target.value)}/>
                <TextInput label='Notes' value={this.props.notes} 
                    onChange={(e) => this.props.onFieldChange('notes', e.target.value)} isMultiLine />
                <StatusInput status={this.props.status} onStatusChange={(s) => this.props.onFieldChange('status', s)} />
                <CheckboxInput label="Is Planned" checked={this.props.is_planned}
                    onCheckedChange={(c) => this.props.onFieldChange('is_planned', c)} />
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}
