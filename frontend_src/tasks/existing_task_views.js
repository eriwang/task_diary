import React from 'react';

import {CommonTaskView, CommonEditableTaskView} from './common_task_views.js';
import {CrossButton, EditButton} from '../common/svg_buttons.js';
import {getDefaultIfUndefined} from '../utils/ternary_utils.js';
import {StatusInput} from '../common/form_components.js';
import TaskManager from '../state_managers/task_manager.js';

class ExistingTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    _handleStatusChange = (status) =>
    {
        TaskManager.editTask({'id': this._getTaskId(), 'status': status});
    }

    _handleEditTask = () =>
    {
        this.props.onEditTask(this._getTaskId());
    }

    _handleDeleteTask = () =>
    {
        TaskManager.deleteTask(this._getTaskId());
    }

    render()
    {
        const task = this.props.task;
        const nameComponent = <p className="task-name">{task.name}</p>;
        const goalComponent = <p>{getDefaultIfUndefined(task.goal, 'No goal')}</p>;
        const statusComponent =
            <StatusInput value={task.status} onChange={(value) => this._handleStatusChange(parseInt(value))} />;
        const notesComponent = 
            <p className="task-notes">{(task.notes != '') ? task.notes : 'Task has no notes.'}</p>;
        const buttonsComponent = 
            <div className="task-modification-container">
                <EditButton onClick={this._handleEditTask} />
                <CrossButton onClick={this._handleDeleteTask} />
            </div>;

        return <CommonTaskView 
            nameComponent={nameComponent}
            goalComponent={goalComponent}
            statusComponent={statusComponent}
            notesComponent={notesComponent}
            buttonsComponent={buttonsComponent}/>;
    }

    _getTaskId = () =>
    {
        return this.props.task.id;
    }
}

class EditableExistingTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        const task = props.task;
        this.state = {
            'name': task.name,
            'notes': task.notes,
            'goalString': '',  // FIXME: make correct
            'status': task.status,
            'isPlanned': task.is_planned  // FIXME: make this changeable
        };
    }

    _handleFieldChange = (key, value) =>
    {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    _handleSubmit = () =>
    {
        const taskId = this.props.task.id;
        TaskManager.editTask({
            'id': taskId,
            'name': this.state.name,
            'goal_id': -1, // FIXME: goalString lookup
            'is_planned': this.state.isPlanned,
            'status': this.state.status,
            'notes': this.state.notes
        })
            .then(() => this.props.onEditTaskComplete(taskId));
    }

    render()
    {
        const buttonsComponent = <button onClick={this._handleSubmit}>Submit</button>;
        return <CommonEditableTaskView name={this.state.name} goalString={this.state.goalString}
            status={this.state.status} notes={this.state.notes}
            onFieldChange={this._handleFieldChange} buttonsComponent={buttonsComponent} startDetailsShown/>;
    }
}

export {ExistingTaskView, EditableExistingTaskView};