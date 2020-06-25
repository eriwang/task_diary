import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import {ajaxGet} from './ajax.js';
import ModalTaskEditForm from './modal_task_edit_form.js';
import TaskEntryForm from './task_entry_form.js';
import TaskView from './task_view.js';

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        const YYYY_MM_DD_LENGTH = 10; // e.g. 2020-06-22
        this.state = {
            'dateStr': (new Date()).toISOString().slice(0, YYYY_MM_DD_LENGTH),
            'tasks': [],
            'is_modal_open': false
        };

        this.refreshTasks = this.refreshTasks.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount()
    {
        this.refreshTasks(this.state.dateStr);
    }

    refreshTasks(dateStr)
    {
        ajaxGet('/date_tasks', {'date': dateStr})
            .done((data) => this.setState({'tasks': data['tasks']}));
    }

    handleEditTask()
    {
        this.setState({'is_modal_open': true});
    }

    handleDateChange(event)
    {
        const dateStr = event.target.value;
        this.setState({'dateStr': dateStr});
        this.refreshTasks(dateStr);
    }

    render()
    {
        const modalTaskEditForm = <ModalTaskEditForm onClose={() => this.setState({'is_modal_open': false})} />;

        return (
            <div>
                <div id="center-view">
                    <TaskView tasks={this.state.tasks} onEditTask={this.handleEditTask}/>
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
                            onTaskEntrySuccessful={() => this.refreshTasks(this.state.dateStr)}/>
                    </div>
                </div>
                {(this.state.is_modal_open) ? modalTaskEditForm : null}
            </div>
            
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
