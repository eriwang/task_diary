import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import {ajaxGet} from './common/ajax.js';
import {DateInput} from './common/form_components.js';
import GoalEntryForm from './goal_entry_form.js';
import GoalManager from './state_managers/goal_manager.js';
import ModalTaskEditForm from './tasks/modal_task_edit_form.js';
import NotesManager from './state_managers/notes_manager.js';
import NotesView from './notes_view.js';
import TaskEntryForm from './tasks/task_entry_form.js';
import TaskView from './tasks/task_view.js';

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'dateStr': getCurrentDateStr(),
            'tasks': [],
            'goals': [],
            'notes': null,
            'currently_edited_task': null
        };
    }

    componentDidMount()
    {
        GoalManager.addListenerCallback(this._handleGoalsChange);
        GoalManager.refreshGoals();
        NotesManager.addListenerCallback(this._handleNotesChange);
        NotesManager.changeDateAndRefresh(this.state.dateStr);
        this._refreshTasksCurrentDate();
    }

    _refreshTasks = (dateStr) =>
    {
        ajaxGet('/date_tasks', {'date': dateStr})
            .done((data) => this.setState({'tasks': data['tasks']}));
    }

    _refreshTasksCurrentDate = () =>
    {
        this._refreshTasks(this.state.dateStr);
    }

    _handleGoalsChange = (goals) =>
    {
        this.setState({'goals': goals});
    }

    _handleNotesChange = (notes) =>
    {
        this.setState({'notes': notes});
    }

    _handleEditTask = (task) =>
    {
        this.setState({'currently_edited_task': task});
    }

    _handleDateChange = (event) =>
    {
        const dateStr = event.target.value;
        this.setState({'dateStr': dateStr});
        this._refreshTasks(dateStr);
        NotesManager.changeDateAndRefresh(dateStr);
    }

    _handleModalEditSuccessful = () =>
    {
        this._refreshTasksCurrentDate();
        this._handleModalClose();
    }

    _handleModalClose = () =>
    {
        this.setState({'currently_edited_task': null});
    }

    render()
    {
        let shownGoals = Array.from(this.state.goals);
        shownGoals.unshift({'id': -1, 'name': 'No goal'});

        const modalTaskEditForm = (this.state.currently_edited_task === null) ? null : (
            <ModalTaskEditForm task={this.state['currently_edited_task']}
                goals={shownGoals}
                onTaskEntrySuccessful={this._handleModalEditSuccessful}
                onClose={this._handleModalClose} />
        );

        return (
            <div>
                <div id="center-view">
                    <div id="date-view-container">
                        <TaskView tasks={this.state.tasks}
                            onEditTask={this._handleEditTask} 
                            onStatusChangeSuccessful={this._refreshTasksCurrentDate}
                            onTaskDeleteSuccessful={this._refreshTasksCurrentDate}/>
                        <NotesView notes={this.state.notes} />
                    </div>
                    <div id="sidebar">
                        <div>
                            <h3>Date Selection</h3>
                            <DateInput label="Date" value={this.state.dateStr} onChange={this._handleDateChange}/>
                        </div>
                        <GoalEntryForm />
                        <TaskEntryForm date={this.state.dateStr}
                            goals={shownGoals}
                            onTaskEntrySuccessful={this._refreshTasksCurrentDate}/>
                    </div>
                </div>
                {modalTaskEditForm}
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
