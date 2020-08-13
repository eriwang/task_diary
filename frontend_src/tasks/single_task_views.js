import React from 'react';

import {CrossButton, EditButton, DropdownButton} from '../common/svg_buttons.js';
import {StatusInput} from '../common/form_components.js';
import Status from '../common/status.js';
import TaskManager from '../state_managers/task_manager.js';

class AddedTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'areDetailsHidden': true};
    }

    _handleStatusChange = (status) =>
    {
        TaskManager.editTask({'id': this.props.task.id, 'status': status});
    }

    _handleEditTask = () =>
    {
        // this.props.onEditTask({
        //     'id': this.props.id,
        //     'date': this.props.date,
        //     'name': this.props.name,
        //     'goalId': this.props.goalId,
        //     'isPlanned': this.props.isPlanned,
        //     'status': this.props.status,
        //     'notes': this.props.notes
        // });
    }

    _handleDeleteTask = () =>
    {
        TaskManager.deleteTask(this.props.task.id);
    }

    render()
    {
        const task = this.props.task;
        const nameComponent = <p className="task-name">{task.name}</p>;
        const goalComponent = <p>{(task.goal !== undefined) ? task.goal : 'No goal'}</p>;
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
}

class EditableTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'name': '',
            'notes': '',
            'goalString': '',
            'status': Status.NOT_STARTED
        };
    }

    _handleFieldChange = (key, value) =>
    {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    // TODO: currently only handles new tasks
    _handleSubmit = () =>
    {
        TaskManager.addTask({
            'name': this.state.name,
            'goal_id': -1,  // FIXME: populate based on goalString lookup. validate if does not exist
            'is_planned': this.props.isPlanned,
            'status': this.state.status,
            'notes': this.state.notes,
        });

        // Note that goalString is intentionally kept the same, as it's likely that the user will input a task with the
        // exact same goal.
        this.setState({'name': '', 'notes': '', 'status': Status.NOT_STARTED});
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
            buttonsComponent={buttonsComponent}/>;
    }
}

class CommonTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'areDetailsHidden': true};
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