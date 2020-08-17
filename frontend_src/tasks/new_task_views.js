import React from 'react';

import {CommonEditableTaskView} from './common_task_views.js';
import Status from '../common/status.js';
import TaskManager from '../state_managers/task_manager.js';
import GoalManager from '../state_managers/goal_manager.js';

class NewTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'name': '',
            'notes': '',
            'goalString': '',
            'status': Status.NOT_STARTED,
            'isPlanned': props.isPlanned
        };
    }

    _handleFieldChange = (key, value) =>
    {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    _handleEnterPressed = () =>
    {
        this._handleSubmit();
    }

    _handleSubmit = () =>
    {
        TaskManager.addTask({
            'name': this.state.name,
            'goal_id': GoalManager.getGoalIdFromName(this.state.goalString),
            'is_planned': this.state.isPlanned,
            'status': this.state.status,
            'notes': this.state.notes,
        });

        // Note that goalString is intentionally kept the same, as it's likely that the user will input a task with
        // the exact same goal on the next task.
        this.setState({'name': '', 'notes': '', 'status': Status.NOT_STARTED});
    }

    render()
    {
        const endComponent = <button onClick={this._handleSubmit}>Submit</button>;
        return <CommonEditableTaskView name={this.state.name} goalString={this.state.goalString}
            status={this.state.status} notes={this.state.notes}
            onEnterPressed={this._handleEnterPressed}
            onFieldChange={this._handleFieldChange} endComponent={endComponent}/>;
    }
}

export {NewTaskView};