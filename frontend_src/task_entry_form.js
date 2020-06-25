import React from 'react';

import {ajaxPost} from './ajax.js';
import Status from './status.js';

class TaskEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'name': '', 'notes': '', 'is_planned': true};

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
    
    // TODO: allow enter to submit when name is focused. for notes I want to allow newlines
    // TODO: validation for empty name on submit
    handleSubmit()
    {
        ajaxPost('/task', {
            'date': this.props.date,
            'name': this.state.name,
            'is_planned': this.state.is_planned,
            'status': Status.NOT_STARTED,
            'notes': this.state.notes
        }).done(() => {
            this.setState({'name': '', 'notes': ''});
            this.props.onTaskEntrySuccessful();
        });
    }

    render()
    {
        return (
            <div id="task-entry">
                <h3>Task Entry</h3>
                <TextInput label='Name' isSingleLine={true} value={this.state.name} 
                    onChange={(e) => this.handleTextChange('name', e)}/>
                <TextInput label='Notes' isSingleLine={false} value={this.state.notes}
                    onChange={(e) => this.handleTextChange('notes', e)}/>
                <div className="entry-checkbox-field">
                    <label htmlFor="entry-is-planned">Is Planned</label>
                    <input type="checkbox" id="entry-is-planned" checked={this.state.is_planned} 
                        onChange={this.handleIsPlannedChange}/>
                </div>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}

// TODO: should be able to make this.props.isSingleLine this.props.isMultiLine instead and make it optional
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
        let textInputElement = this.props.isSingleLine ?
            <input type="text" id={entryId} onChange={this.props.onChange} value={this.props.value} /> : 
            <textarea id={entryId} onChange={this.props.onChange} value={this.props.value}
                className="entry-textarea" />;
        return (
            <div className="entry-text-field">
                <label htmlFor={entryId}>{this.props.label}</label>
                {textInputElement}
            </div>
        );
    }
}

export default TaskEntryForm;
