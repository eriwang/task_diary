import React from 'react';

import {TextInput, DateInput, DropdownInput, StatusInput, CheckboxInput} from './form_components.js';

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
        let data = {
            'id': this.props.id,
            'date': this.props.date,
            'name': this.props.name,
            'is_planned': this.props.is_planned,
            'status': this.props.status,
            'notes': this.props.notes
        };
        if (this.props.goal != -1)
        {
            data['goal_id'] = this.props.goal;
        }

        this.props.onSubmitTask(data);
    }

    render()
    {
        const goalOptions = this.props.goals.map((g) => {
            return {'id': g.id, 'value': g.id, 'label': g.name};
        });
        const dateInput = (this.props.showDateInput === undefined) ? null : (
            <DateInput label="Date" value={this.props.date}
                onChange={(e) => this.props.onFieldChange('date', e.target.value)} />
        );

        return (
            <div>
                <TextInput label="Name" value={this.props.name} 
                    onChange={(e) => this.props.onFieldChange('name', e.target.value)}/>
                <TextInput label="Notes" value={this.props.notes} 
                    onChange={(e) => this.props.onFieldChange('notes', e.target.value)} isMultiLine />
                {dateInput}
                <StatusInput label="Status" value={this.props.status} 
                    onChange={(value) => this.props.onFieldChange('status', parseInt(value))} />
                <DropdownInput label="Goal" options={goalOptions} value={this.props.goal_id}
                    onChange={(value) => this.props.onFieldChange('goal', parseInt(value))} />
                <CheckboxInput label="Is Planned" checked={this.props.is_planned}
                    onCheckedChange={(c) => this.props.onFieldChange('is_planned', c)} />
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}
