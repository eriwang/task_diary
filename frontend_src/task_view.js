import React from 'react';

import {ajaxPut} from './ajax.js';
import StatusDropdown from './status_dropdown.js';

class TaskView extends React.Component
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
                <Task key={task['id']} id={task['id']} date={task['date']} name={task['name']}
                    is_planned={task['is_planned']} status={task['status']} notes={task['notes']}
                    onEditTask={this.props.onEditTask}/>
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

/* TODO: Date/ planned are only on here because I want to pass all the task information back when editing.
 *       The Task rendering component has no need to know about either of those.
 *       Is the better design pattern to have a TaskStore that's the source of truth, that everything reads?
 */
class Task extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'are_details_hidden': true, 'status': props.status};

        this.handleToggleDetails = this.handleToggleDetails.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
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
            .done((data) => this.setState({'status': data['status']}));
    }

    handleEditTask()
    {
        this.props.onEditTask({
            'id': this.props.id,
            'date': this.props.date,
            'name': this.props.name,
            'is_planned': this.props.is_planned,
            'status': this.state.status,
            'notes': this.props.notes
        });
    }

    render()
    {
        const taskHideable = this.state.are_details_hidden ? null : (
            <div className="task-hideable-container">
                <p className="task-notes">{(this.props.notes != '') ? this.props.notes : 'Task has no notes.'}</p>
                <div className="task-modification-container">
                    <button onClick={this.handleEditTask}>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
        );

        return (
            <div className="task">
                <div className="task-always-shown">
                    <p className="task-name">{this.props.name}</p>
                    <div className="task-flush-right-container">
                        <p>Goal=Something</p>
                        <StatusDropdown status={this.state.status} onStatusChange={this.handleStatusChange} />
                        <button onClick={this.handleToggleDetails}>Toggle Details</button>
                    </div>
                </div>
                {taskHideable}
            </div>
        );
    }
}

export default TaskView;
