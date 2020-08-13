import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import CollapsibleSidebar from './collapsible_sidebar.js';
import GoalManager from './state_managers/goal_manager.js';
import NotesManager from './state_managers/notes_manager.js';
import NotesView from './notes_view.js';
import StickyHeader from './sticky_header.js';
import TaskView from './tasks/task_view.js';
import TaskManager from './state_managers/task_manager.js';

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
            'currentlyEditedTask': null,
            'sidebarVisible': false
        };
    }

    componentDidMount()
    {
        GoalManager.addListenerCallback(this._handleGoalsChange);
        GoalManager.refreshGoals();
        NotesManager.addListenerCallback(this._handleNotesChange);
        NotesManager.changeDateAndRefresh(this.state.dateStr);
        TaskManager.addListenerCallback(this._handleTasksChange);
        TaskManager.changeDateAndRefresh(this.state.dateStr);
    }

    _handleGoalsChange = (goals) =>
    {
        this.setState({'goals': goals});
    }

    _handleNotesChange = (notes) =>
    {
        this.setState({'notes': notes});
    }

    _handleTasksChange = (tasks) =>
    {
        this.setState({'tasks': tasks});
    }

    _handleEditTask = (task) =>
    {
        this.setState({'currentlyEditedTask': task});
    }

    _handleDateChange = (event) =>
    {
        const dateStr = event.target.value;
        this.setState({'dateStr': dateStr});

        NotesManager.changeDateAndRefresh(dateStr);
        TaskManager.changeDateAndRefresh(dateStr);
    }

    // TODO: not a fan of how state and callbacks end up being across so many files. Read the docs and see what their
    //       suggested solution is, or go to state managers like the other ones.
    _handleMenuClick = () =>
    {
        this.setState({'sidebarVisible': true});
    }

    _handleMenuClose = () => 
    {
        this.setState({'sidebarVisible': false});
    }

    render()
    {
        let shownGoals = Array.from(this.state.goals);
        shownGoals.unshift({'id': -1, 'name': 'No goal'});

        return (
            <div>
                <StickyHeader onMenuClick={this._handleMenuClick} onDateChange={this._handleDateChange}
                    dateStr={this.state.dateStr}/>
                <CollapsibleSidebar visible={this.state.sidebarVisible} closeSidebar={this._handleMenuClose}/>
                <div id="center-view">
                    <div id="date-view-container">
                        <TaskView tasks={this.state.tasks} />
                    </div>
                    <div id="notes-container">
                        <NotesView notes={this.state.notes} />
                    </div>
                </div>
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

/* TODO: stuff to complete the "task UI refactor"
 *  - Functioning edit button, transforming the AddTask to an EditableTask
 *  - Functioning goal input/ fuzzy search on new/ editable task
 *  - "Ok" (i.e. save) and "cancel" buttons. Enter works as "ok", escape works as "cancel".
 *      - Thought about click away, focus away, or press escape and everything in the task gets saved. I'm not that 
 *        ballsy to do this without an undo button.
 */