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
                <AddedTaskView key={task['id']} task={task} onEditTask={this.props.onEditTask} />
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