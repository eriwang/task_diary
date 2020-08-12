import React from 'react';

import {ajaxPut, ajaxDelete} from '../common/ajax.js';
import {StatusInput} from '../common/form_components.js';
import {CrossButton, EditButton, DropdownButton} from '../common/svg_buttons.js';

export default class TaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    renderTaskDiv(tasks)
    {
        return <div>{(tasks.length == 0) ? 'None' : tasks}</div>;
    }

    render()
    {
        let plannedTasks = [];
        let unplannedTasks = [];
        for (const task of this.props.tasks)
        {
            let taskArray = (task['is_planned']) ? plannedTasks : unplannedTasks;
            taskArray.push(
                <Task key={task['id']} id={task['id']} date={task['date']} name={task['name']} goal={task['goal']}
                    goal_id={task['goal_id']} is_planned={task['is_planned']} status={task['status']}
                    notes={task['notes']}
                    onEditTask={this.props.onEditTask} 
                    onStatusChangeSuccessful={this.props.onStatusChangeSuccessful}
                    onTaskDeleteSuccessful={this.props.onTaskDeleteSuccessful}/>
            );
        }

        return (
            <div id="task-view">
                <h3>Tasks</h3>
                <h4>Planned</h4>
                {this.renderTaskDiv(plannedTasks)}
                <h4>Unplanned</h4>
                {this.renderTaskDiv(unplannedTasks)}
            </div>
        );
    }
}

/* Date/ planned are only on here because I want to pass all the task information back when editing.
 * The Task rendering component has no need to know about either of those.
 * The better design pattern might be to have a TaskStore that's the source of truth that everything reads.
 * Worth noting that there's a big stench (bad smell :) ) associated with this: right now the state controller is App,
 * and everything has to pass its state back there through multiple levels, resulting in tons of confusing callbacks.
 */
class Task extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'are_details_hidden': true};

        this.handleToggleDetails = this.handleToggleDetails.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
    }

    handleToggleDetails()
    {
        this.setState((state) => {
            return {'are_details_hidden': !state.are_details_hidden};
        });
    }

    handleStatusChange(status)
    {
        ajaxPut('/task', {'id': this.props.id, 'status': status})
            .done(this.props.onStatusChangeSuccessful);
    }

    handleEditTask()
    {
        this.props.onEditTask({
            'id': this.props.id,
            'date': this.props.date,
            'name': this.props.name,
            'goal_id': this.props.goal_id,
            'is_planned': this.props.is_planned,
            'status': this.props.status,
            'notes': this.props.notes
        });
    }

    handleDeleteTask()
    {
        ajaxDelete('/task', {'id': this.props.id})
            .done(() => this.props.onTaskDeleteSuccessful());
    }

    render()
    {
        const taskHideable = this.state.are_details_hidden ? null : (
            <TaskHideableSection notes={this.props.notes} onEditTask={this.handleEditTask}
                onDeleteTask={this.handleDeleteTask}/>
        );

        return (
            <div className="task">
                <div className="task-always-shown">
                    <p className="task-name">{this.props.name}</p>
                    <div className="task-flush-right-container">
                        <p>{(this.props.goal !== undefined) ? this.props.goal : 'No goal'}</p>
                        <StatusInput value={this.props.status}
                            onChange={(value) => this.handleStatusChange(parseInt(value))} />
                        <DropdownButton onClick={this.handleToggleDetails} isDropped={!this.state.are_details_hidden}/>
                    </div>
                </div>
                {taskHideable}
            </div>
        );
    }
}

class TaskHideableSection extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        // TODO: at some point the delete task should get a confirmation modal
        const notes = (this.props.notes != '') ? this.props.notes : 'Task has no notes.';
        return (
            <div className="task-hideable-container">
                <p className="task-notes">{notes}</p>
                <div className="task-modification-container">
                    <EditButton onClick={this.props.onEditTask} />
                    <CrossButton onClick={this.props.onDeleteTask} />
                </div>
            </div>
        );

    }
}