import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import CollapsibleSidebar from './collapsible_sidebar.js';
import ConfirmationModal from './common/confirmation_modal.js';
import EditingFieldTracker from './state_trackers/editing_field_tracker.js';
import GoalManager from './state_managers/goal_manager.js';
import NotesManager from './state_managers/notes_manager.js';
import NotesView from './notes_view.js';
import OngoingChangeRequestTracker from './state_trackers/ongoing_change_request_tracker.js';
import StickyHeader from './sticky_header.js';
import TaskView from './tasks/task_view.js';
import TaskManager from './state_managers/task_manager.js';

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.storedDateStrAwaitingConfirm = null;
        this.state = {
            'dateStr': getCurrentDateStr(),
            'tasks': [],
            'notes': null,
            'sidebarVisible': false,
            'confirmationModalVisible': false
        };
    }

    componentDidMount()
    {
        GoalManager.refreshGoals();
        NotesManager.addListenerCallback((notes) => this.setState({'notes': notes}));
        NotesManager.changeDateAndRefresh(this.state.dateStr);
        TaskManager.addListenerCallback((tasks) => this.setState({'tasks': tasks}));
        TaskManager.changeDateAndRefresh(this.state.dateStr);
    }

    _handleDateChange = (event) =>
    {
        const dateStr = event.target.value;
        const changesPending = 
            (EditingFieldTracker.currentlyEditingField() || OngoingChangeRequestTracker.requestsAreInProgress());
        if (changesPending)
        {
            this.storedDateStrAwaitingConfirm = dateStr;
            this.setState({'confirmationModalVisible': true});
            return;
        }

        this._changeDate(dateStr);
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

    _handleConfirmationModalConfirm = () =>
    {
        // We force clear edits so the other views get their right state, but we don't force clear the actual request
        // tracking, as if it's taking very long we do want to know it's still going.
        EditingFieldTracker.forceClearEdits();
        this.setState({'confirmationModalVisible': false});
        this._changeDate(this.storedDateStrAwaitingConfirm);
        this.storedDateStrAwaitingConfirm = null;
    }

    _changeDate(dateStr)
    {
        this.setState({'dateStr': dateStr});

        NotesManager.changeDateAndRefresh(dateStr);
        TaskManager.changeDateAndRefresh(dateStr);
    }

    render()
    {
        const CONFIRMATION_MODAL_MESSAGE = 
            'You have unsaved changes or a change still being sent to the server. Do you still wish to continue?';
        const confirmationModal = (!this.state.confirmationModalVisible) ? null : (
            <ConfirmationModal title="Unsaved Changes" message={CONFIRMATION_MODAL_MESSAGE}
                onClose={() => this.setState({'confirmationModalVisible': false})}
                onConfirm={this._handleConfirmationModalConfirm} />
        );

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
                {confirmationModal}
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
