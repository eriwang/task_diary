import React from 'react';

import {ajaxPut} from './ajax.js';
import TaskForm from './task_form.js';

export default class ModalTaskEditForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'date': this.props.task.date,
            'name': this.props.task.name,
            'is_planned': this.props.task.is_planned,
            'status': this.props.task.status,
            'notes': this.props.task.notes,            
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
        ajaxPut('/task', task).done(() => {
            this.props.onTaskEntrySuccessful();
        });
    }

    render()
    {
        return (
            <div className="modal">
                <div className="modal-content">
                    <h3>Edit Task</h3>
                    <TaskForm id={this.props.task.id} date={this.state.date} name={this.state.name} 
                        is_planned={this.state.is_planned} status={this.state.status} notes={this.state.notes}
                        goal={this.state.goal}
                        goals={this.props.goals}
                        onFieldChange={this.handleFieldChange}
                        onSubmitTask={this.handleSubmit} />
                    <button onClick={this.props.onClose}>Close</button>
                </div>
            </div>
        );
    }
}
