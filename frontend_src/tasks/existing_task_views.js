import React from 'react';

import {CheckboxInput} from '../common/form_components.js';
import {CheckButton, CrossButton, EditButton} from '../common/svg_buttons.js';
import {CommonTaskView, CommonEditableTaskView} from './common_task_views.js';
import {getDefaultIfUndefined} from '../utils/ternary_utils.js';
import {StatusInput} from '../common/form_components.js';
import TaskManager from '../state_managers/task_manager.js';
import GoalManager from '../state_managers/goal_manager.js';

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
        const endComponent = 
            <div className="task-modification-container">
                <EditButton onClick={this._handleEditTask} />
                <CrossButton onClick={this._handleDeleteTask} />
            </div>;

        return <CommonTaskView 
            nameComponent={nameComponent}
            goalComponent={goalComponent}
            statusComponent={statusComponent}
            notesComponent={notesComponent}
            endComponent={endComponent}/>;
    }

    _getTaskId = () =>
    {
        return this.props.task.id;
    }
}

// TODO: would be nice if I maintained the dropdown status after completion
class EditableExistingTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        const task = props.task;
        this.state = {
            'name': task.name,
            'notes': task.notes,
            'goalString': getDefaultIfUndefined(task.goal, ''),
            'status': task.status,
            'isPlanned': task.is_planned
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
        // TODO: graceful nonexistent goal handling
        TaskManager.editTask({
            'id': this.props.task.id,
            'name': this.state.name,
            'goal_id': GoalManager.getGoalIdFromName(this.state.goalString),
            'is_planned': this.state.isPlanned,
            'status': this.state.status,
            'notes': this.state.notes
        })
            .then(this._handleExitEditMode);
    }

    _handleExitEditMode = () =>
    {
        this.props.onEditTaskComplete(this.props.task.id);
    }

    render()
    {
        const endComponent = 
            <div>
                <CheckboxInput label="Is Planned" checked={this.state.isPlanned}
                    onCheckedChange={(checked) => this._handleFieldChange('isPlanned', checked)} />
                <div className="task-modification-container">
                    <CheckButton onClick={this._handleSubmit} />
                    <CrossButton onClick={this._handleExitEditMode} />
                </div>
            </div>
            ;
        return <CommonEditableTaskView name={this.state.name} goalString={this.state.goalString}
            status={this.state.status} notes={this.state.notes}
            onEnterPressed={this._handleSubmit} onEscapePressed={this._handleExitEditMode}
            onFieldChange={this._handleFieldChange} endComponent={endComponent} startDetailsShown
            autoFocus={true}/>;
    }
}

export {ExistingTaskView, EditableExistingTaskView};