import React from 'react';

import {TextInput} from './form_components.js';
import GoalManager from './state_managers/goal_manager.js';

export default class GoalEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'name': ''};

        this.handleGoalNameChange = this.handleGoalNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleGoalNameChange(event)
    {
        this.setState({'name': event.target.value});
    }

    handleSubmit()
    {
        GoalManager.addGoal(this.state.name)
            .done(() => this.setState({'name': ''}));
    }

    render()
    {
        return (
            <div>
                <h3>Create New Goal</h3>
                <TextInput label="Name" value={this.state.name} onChange={this.handleGoalNameChange}/>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}
