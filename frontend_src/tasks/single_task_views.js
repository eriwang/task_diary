import React from 'react';

import {ajaxPut, ajaxDelete} from '../common/ajax.js';
import {CrossButton, EditButton, DropdownButton} from '../common/svg_buttons.js';
import {StatusInput} from '../common/form_components.js';
import Status from '../common/status.js';

/* Date/ planned are only on here because I want to pass all the task information back when editing.
 * The Task rendering component has no need to know about either of those.
 * The better design pattern might be to have a TaskStore that's the source of truth that everything reads.
 * Worth noting that there's a big stench (bad smell :) ) associated with this: right now the state controller is App,
 * and everything has to pass its state back there through multiple levels, resulting in tons of confusing callbacks.
 */
class AddedTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'areDetailsHidden': true};
    }

    /* these three are unique to the regular view */
    _handleStatusChange = (status) =>
    {
        ajaxPut('/task', {'id': this.props.id, 'status': status})
            .done(this.props.onStatusChangeSuccessful);
    }

    _handleEditTask = () =>
    {
        this.props.onEditTask({
            'id': this.props.id,
            'date': this.props.date,
            'name': this.props.name,
            'goalId': this.props.goalId,
            'isPlanned': this.props.isPlanned,
            'status': this.props.status,
            'notes': this.props.notes
        });
    }

    _handleDeleteTask = () =>
    {
        ajaxDelete('/task', {'id': this.props.id})
            .done(() => this.props.onTaskDeleteSuccessful());
    }

    render()
    {
        const nameComponent = <p className="task-name">{this.props.name}</p>;
        const goalComponent = <p>{(this.props.goal !== undefined) ? this.props.goal : 'No goal'}</p>;
        const statusComponent =
            <StatusInput value={this.props.status} onChange={(value) => this._handleStatusChange(parseInt(value))} />;
        const notesComponent = 
            <p className="task-notes">{(this.props.notes != '') ? this.props.notes : 'Task has no notes.'}</p>;
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
            <textarea placeholder="Notes" value={this.state.notes}
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