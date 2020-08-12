import React from 'react';

import {TextInput} from './common/form_components.js';
import GoalManager from './state_managers/goal_manager.js';

export default class GoalEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'name': ''};
    }

    _handleGoalNameChange = (event) =>
    {
        this.setState({'name': event.target.value});
    }

    _handleSubmit = () =>
    {
        GoalManager.addGoal(this.state.name)
            .done(() => this.setState({'name': ''}));
    }

    render()
    {
        return (
            <div>
                <h3>Create New Goal</h3>
                <TextInput label="Name" value={this.state.name} onChange={this._handleGoalNameChange}/>
                <button onClick={this._handleSubmit}>Submit</button>
            </div>
        );
    }
}
