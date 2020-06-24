import React from 'react';

class TaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        if (this.props.tasks.length == 0)
        {
            return <h3>Loading task view...</h3>;
        }

        let tasks = this.props.tasks.map(task => 
            <Task key={task['id']} date={task['date']} description={task['description']} 
                is_planned={task['is_planned']} status={task['status']} notes={task['notes']}/>
        );

        return (
            <div id="task-view">
                <h3>Tasks</h3>
                <div id="tasks">{tasks}</div>
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
                <p>{this.props.description}</p>
                <p>is_planned={this.props.is_planned}, status={this.props.status}</p>
                <p>notes={this.props.notes}</p>
            </div>
        );
    }
}

export default TaskView;
