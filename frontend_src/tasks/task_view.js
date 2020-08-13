import React from 'react';

import {AddedTaskView, EditableTaskView} from './single_task_views.js';

export default class TaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        let plannedTasks = [];
        let unplannedTasks = [];
        for (const task of this.props.tasks)
        {
            let taskArray = (task['is_planned']) ? plannedTasks : unplannedTasks;
            taskArray.push(
                <AddedTaskView key={task['id']} id={task['id']} date={task['date']} name={task['name']}
                    goal={task['goal']} goal_id={task['goal_id']} is_planned={task['is_planned']} 
                    status={task['status']} notes={task['notes']}
                    onEditTask={this.props.onEditTask} 
                    onStatusChangeSuccessful={this.props.onStatusChangeSuccessful}
                    onTaskDeleteSuccessful={this.props.onTaskDeleteSuccessful}/>
            );
        }

        return (
            <div id="task-view">
                <h3>Tasks</h3>
                <h4>Planned</h4>
                <div>
                    {plannedTasks}
                    <EditableTaskView isPlanned={true} />
                </div>
                <h4>Unplanned</h4>
                <div>
                    {plannedTasks}
                    <EditableTaskView isPlanned={false} />
                </div>
            </div>
        );
    }
}