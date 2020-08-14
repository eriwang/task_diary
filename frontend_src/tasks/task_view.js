import React from 'react';

import {ExistingTaskView, EditableExistingTaskView} from './existing_task_views.js';
import {NewTaskView} from './new_task_views';

export default class TaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'currentlyEditableTasks': new Set()
        };
    }

    // React does a shallow compare on state, so in these functions we make a brand new set instead of just calling 
    // functions on the state set.
    _handleAddedTaskEditTask = (taskId) =>
    {
        this.setState(state => {
            let newEditableTasks = new Set(state.currentlyEditableTasks);
            newEditableTasks.add(taskId);
            return {'currentlyEditableTasks': newEditableTasks};
        });
    }

    _handleEditTaskComplete = (taskId) =>
    {
        this.setState(state => {
            let newEditableTasks = new Set(state.currentlyEditableTasks);
            if (!newEditableTasks.delete(taskId))
            {
                throw `Removing ${taskId} from editable task set failed.`;
            }
            return {'currentlyEditableTasks': newEditableTasks};
        });
    }

    render()
    {
        let plannedTasks = [];
        let unplannedTasks = [];
        for (const task of this.props.tasks)
        {
            let taskArray = (task['is_planned']) ? plannedTasks : unplannedTasks;
            const taskComponent = (this.state.currentlyEditableTasks.has(task['id'])) ? 
                <EditableExistingTaskView key={task['id']} task={task}
                    onEditTaskComplete={this._handleEditTaskComplete} /> : 
                <ExistingTaskView key={task['id']} task={task} onEditTask={this._handleAddedTaskEditTask} />;
            taskArray.push(taskComponent);
        }

        return (
            <div id="task-view">
                <h3>Tasks</h3>
                <h4>Planned</h4>
                <div>
                    {plannedTasks}
                    <NewTaskView isPlanned={true} />
                </div>
                <h4>Unplanned</h4>
                <div>
                    {unplannedTasks}
                    <NewTaskView isPlanned={false} />
                </div>
            </div>
        );
    }
}