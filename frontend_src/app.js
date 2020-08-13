import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import {ajaxGet} from './common/ajax.js';
import CollapsibleSidebar from './collapsible_sidebar.js';
import GoalManager from './state_managers/goal_manager.js';
import ModalTaskEditForm from './tasks/modal_task_edit_form.js';
import NotesManager from './state_managers/notes_manager.js';
import NotesView from './notes_view.js';
import StickyHeader from './sticky_header.js';
import TaskView from './tasks/task_view.js';

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        // TODO: inconsistent key name style
        this.state = {
            'dateStr': getCurrentDateStr(),
            'tasks': [],
            'goals': [],
            'notes': null,
            'currently_edited_task': null,
            'sidebar_visible': false
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

    // TODO: not a fan of how state and callbacks end up being across so many files. Read the docs and see what their
    //       suggested solution is, or go to state managers like the other ones.
    _handleMenuClick = () =>
    {
        this.setState({'sidebar_visible': true});
    }

    _handleMenuClose = () => 
    {
        this.setState({'sidebar_visible': false});
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
                <StickyHeader onMenuClick={this._handleMenuClick} onDateChange={this._handleDateChange}
                    dateStr={this.state.dateStr}/>
                <CollapsibleSidebar visible={this.state.sidebar_visible} closeSidebar={this._handleMenuClose}/>
                <div id="center-view">
                    <div id="date-view-container">
                        <TaskView tasks={this.state.tasks}
                            onEditTask={this._handleEditTask} 
                            onStatusChangeSuccessful={this._refreshTasksCurrentDate}
                            onTaskDeleteSuccessful={this._refreshTasksCurrentDate}/>
                    </div>
                    <div id="notes-container">
                        <NotesView notes={this.state.notes} />
                    </div>
                    {/* <div id="sidebar">
                        <div>
                            <h3>Date Selection</h3>
                            <DateInput label="Date" value={this.state.dateStr} onChange={this._handleDateChange}/>
                        </div>
                        <GoalEntryForm />
                        <TaskEntryForm date={this.state.dateStr}
                            goals={shownGoals}
                            onTaskEntrySuccessful={this._refreshTasksCurrentDate}/>
                    </div> */}
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
