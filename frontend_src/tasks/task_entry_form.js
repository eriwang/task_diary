import React from 'react';

import {ajaxPost} from '../common/ajax.js';
import Status from '../common/status.js';
import TaskForm from './task_form.js';

export default class TaskEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'name': '',
            'notes': '',
            'goal': -1,  // no goal
            'is_planned': true,
            'status': Status.NOT_STARTED
        };

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFieldChange(fieldName, value)
    {
        const newState = {};
        newState[fieldName] = value;
        this.setState(newState);
    }

    handleSubmit(task)
    {
        if (task['id'] !== null)
        {
            throw `Expected id to be null for new task entry, but is ${task['id']}`;
        }
        delete task.id;

        ajaxPost('/task', task).done(() => {
            this.setState({'name': '', 'notes': '', 'status': Status.NOT_STARTED});
            this.props.onTaskEntrySuccessful();
        });
    }

    render()
    {
        return (
            <div>
                <h3>Task Entry</h3>
                <TaskForm id={null} date={this.props.date} name={this.state.name} is_planned={this.state.is_planned}
                    status={this.state.status} notes={this.state.notes} goal={this.state.goal}
                    goals={this.props.goals}
                    onFieldChange={this.handleFieldChange}
                    onSubmitTask={this.handleSubmit} />
            </div>
        );
    }
}
