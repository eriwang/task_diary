import React from 'react';

import {CrossButton, EditButton, DropdownButton} from '../common/svg_buttons.js';
import {getDefaultIfUndefined} from '../utils/ternary_utils.js';
import {StatusInput} from '../common/form_components.js';
import Status from '../common/status.js';
import TaskManager from '../state_managers/task_manager.js';

class AddedTaskView extends React.Component
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

// TODO: should I split this into a "new task view" and "editable task view"?
class EditableTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        
        if (this._isModifyingTask())
        {
            const task = props.modifyingTask;
            this.state = {
                'name': task.name,
                'notes': task.notes,
                'goalString': '',  // FIXME: make correct
                'status': task.status,
                'isPlanned': task.is_planned
            };
        }
        else
        {
            this.state = {
                'name': '',
                'notes': '',
                'goalString': '',
                'status': Status.NOT_STARTED,
                'isPlanned': props.isPlanned
            };
        }
    }

    _handleFieldChange = (key, value) =>
    {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    _handleSubmit = () =>
    {
        if (this._isModifyingTask())
        {
            const taskId = this.props.modifyingTask.id;
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
        else
        {
            TaskManager.addTask({
                'name': this.state.name,
                'goal_id': -1,  // FIXME: populate based on goalString lookup. validate if does not exist
                'is_planned': this.state.isPlanned,
                'status': this.state.status,
                'notes': this.state.notes,
            });
    
            // Note that goalString is intentionally kept the same, as it's likely that the user will input a task with
            // the exact same goal.
            this.setState({'name': '', 'notes': '', 'status': Status.NOT_STARTED});
        }
    }

    render()
    {
        const nameComponent = 
            <input className="task-name" placeholder="Name" value={this.state.name} 
                onChange={(e) => this._handleFieldChange('name', e.target.value)}/>;
        const goalComponent =
            <input placeholder="Goal" value={this.state.goalString} 
                onChange={(e) => this._handleFieldChange('goalString', e.target.value)}/>;
        const statusComponent =
            <StatusInput value={this.state.status}
                onChange={(value) => this._handleFieldChange('status', parseInt(value))} />;
        const notesComponent = 
            <textarea className="task-notes" placeholder="Notes" value={this.state.notes}
                onChange={(e) => this._handleFieldChange('notes', e.target.value)}/>;
        const buttonsComponent = <button onClick={this._handleSubmit}>Submit</button>;

        return <CommonTaskView 
            nameComponent={nameComponent}
            goalComponent={goalComponent}
            statusComponent={statusComponent}
            notesComponent={notesComponent}
            buttonsComponent={buttonsComponent}
            startDetailsShown={this.props.startDetailsShown}/>;
    }

    _isModifyingTask = () =>
    {
        return this.props.modifyingTask !== undefined;
    }
}

class CommonTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'areDetailsHidden': (props.startDetailsShown === undefined)};
    }

    _handleToggleDetails = () =>
    {
        this.setState((state) => {
            return {'areDetailsHidden': !state.areDetailsHidden};
        });
    }

    render()
    {
        const hideableComponent = this.state.areDetailsHidden ? null : (
            <div className="task-hideable-container">
                {this.props.notesComponent}
                {this.props.buttonsComponent}
            </div>
        );

        return (
            <div className="task-container">
                <div className="task">
                    <div className="task-always-shown">
                        <div className="task-name-goal-container">
                            {this.props.nameComponent}
                            {this.props.goalComponent}
                        </div>
                        <div className="task-flush-right-container">
                            {this.props.statusComponent}
                        </div>
                    </div>
                    {hideableComponent}
                </div>
                <div className="task-dropdown-button">
                    <DropdownButton onClick={this._handleToggleDetails} isDropped={!this.state.areDetailsHidden}/>
                </div>
            </div>
        );
    }
}

export {AddedTaskView, EditableTaskView};