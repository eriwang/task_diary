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
    }

    render()
    {
        return (
            <div className="task">
                <p>{this.props.name}</p>
                <p>status={this.props.status}</p>
                <p>notes={this.props.notes}</p>
            </div>
        );
    }
}

export default TaskView;
