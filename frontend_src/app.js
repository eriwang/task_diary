import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import {ajaxGet} from './ajax.js';
import ModalTaskEditForm from './modal_task_edit_form.js';
import GoalManager from './state_managers/goal_manager.js';
import TaskEntryForm from './task_entry_form.js';
import TaskView from './task_view.js';

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'dateStr': getCurrentDateStr(),
            'tasks': [],
            'goals': [],
            'currently_edited_task': null
        };

        this.handleGoalsChange = this.handleGoalsChange.bind(this);
        this.refreshTasks = this.refreshTasks.bind(this);
        this.refreshTasksCurrentDate = this.refreshTasksCurrentDate.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleModalEditSuccessful = this.handleModalEditSuccessful.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    componentDidMount()
    {
        GoalManager.addListenerCallback(this.handleGoalsChange);
        GoalManager.refreshGoals();
        this.refreshTasksCurrentDate();
    }

    handleGoalsChange(goals)
    {
        this.setState({'goals': goals});
    }

    refreshTasks(dateStr)
    {
        ajaxGet('/date_tasks', {'date': dateStr})
            .done((data) => this.setState({'tasks': data['tasks']}));
    }

    refreshTasksCurrentDate()
    {
        this.refreshTasks(this.state.dateStr);
    }

    handleEditTask(task)
    {
        this.setState({'currently_edited_task': task});
    }

    handleDateChange(event)
    {
        const dateStr = event.target.value;
        this.setState({'dateStr': dateStr});
        this.refreshTasks(dateStr);
    }

    handleModalEditSuccessful()
    {
        this.refreshTasksCurrentDate();
        this.handleModalClose();
    }

    handleModalClose()
    {
        this.setState({'currently_edited_task': null});
    }

    render()
    {
        let shownGoals = Array.from(this.state.goals);
        shownGoals.unshift({'id': -1, 'name': 'No goal'});

        const modalTaskEditForm = (
            <ModalTaskEditForm task={this.state['currently_edited_task']}
                goals={shownGoals}
                onTaskEntrySuccessful={this.handleModalEditSuccessful}
                onClose={this.handleModalClose} />
        );

        return (
            <div>
                <div id="center-view">
                    <TaskView tasks={this.state.tasks}
                        onEditTask={this.handleEditTask} 
                        onStatusChangeSuccessful={this.refreshTasksCurrentDate}
                        onTaskDeleteSuccessful={this.refreshTasksCurrentDate}/>
                    <div id="sidebar">
                        <div>
                            <h3>Date Selection</h3>
                            <div className="entry-multi-row-field">
                                <label htmlFor="date-selector">Date</label>
                                <input type="date" id="date-selector" onChange={this.handleDateChange}
                                    value={this.state.dateStr}/>
                            </div>
                        </div>
                        <TaskEntryForm date={this.state.dateStr}
                            goals={shownGoals}
                            onTaskEntrySuccessful={this.refreshTasksCurrentDate}/>
                    </div>
                </div>
                {(this.state.currently_edited_task !== null) ? modalTaskEditForm : null}
            </div>
        );
    }
}

function getCurrentDateStr()
{
    const today = new Date();
    const monthStr = (today.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = (today.getDate()).toString().padStart(2, '0');
    return `${today.getFullYear()}-${monthStr}-${dayStr}`;
}

ReactDOM.render(<App />, document.getElementById('app'));
