import React from 'react';

class TaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        let tasks = this.props.tasks.map(task => 
            <Task key={task['id']} date={task['date']} name={task['name']} 
                is_planned={task['is_planned']} status={task['status']} notes={task['notes']}/>
        );

        return (
            <div id="task-view">
                <h3>Tasks</h3>
                <div id="tasks">{(tasks.length == 0) ? 'No tasks' : tasks}</div>
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
                <p>{this.props.date}</p>
                <p>{this.props.name}</p>
                <p>is_planned={this.props.is_planned}, status={this.props.status}</p>
                <p>notes={this.props.notes}</p>
            </div>
        );
    }
}

export default TaskView;
