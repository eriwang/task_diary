import React from 'react';

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
                <Task key={task['id']} name={task['name']} status={task['status']} notes={task['notes']} />
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

class Task extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'are_details_hidden': true, 'status': props.status};

        this.handleToggleDetails = this.handleToggleDetails.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    handleToggleDetails()
    {
        this.setState((state) => {
            return {'are_details_hidden': !state.are_details_hidden};
        });
    }

    handleStatusChange(event)
    {
        this.setState({'status': parseInt(event.target.value)});
    }

    render()
    {
        const taskHideable = this.state.are_details_hidden ? null : (
            <div className="task-hideable-container">
                <p className="task-notes">{(this.props.notes != '') ? this.props.notes : 'Task has no notes.'}</p>
            </div>
        );

        return (
            <div className="task">
                <div className="task-always-shown">
                    <p className="task-name">{this.props.name}</p>
                    <div className="task-flush-right-container">
                        <p>Goal=Something</p>
                        <select value={this.state.status} onChange={this.handleStatusChange}>
                            <option value="0">Not Started</option>
                            <option value="1">In Progress</option>
                            <option value="2">Complete</option>
                            <option value="3">Dropped</option>
                        </select>
                        <button onClick={this.handleToggleDetails}>Toggle Details</button>
                    </div>
                </div>
                {taskHideable}
            </div>
        );
    }
}

export default TaskView;
