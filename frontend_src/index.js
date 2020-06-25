import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import {ajaxGet} from './ajax.js';
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
            'tasks': []
        };

        this.refreshTasks = this.refreshTasks.bind(this);
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

    handleDateChange(event)
    {
        const dateStr = event.target.value;
        this.setState({'dateStr': dateStr});
        this.refreshTasks(dateStr);
    }

    render()
    {
        return (
            <div id="center-view">
                <TaskView tasks={this.state.tasks} />
                <div id="sidebar">
                    <div>
                        <h3>Date Selection</h3>
                        <div className="entry-text-field">
                            <label htmlFor="date-selector">Date</label>
                            <input type="date" id="date-selector" onChange={this.handleDateChange}
                                value={this.state.dateStr}/>
                        </div>
                    </div>
                    <TaskEntryForm date={this.state.dateStr} 
                        onTaskEntrySuccessful={() => this.refreshTasks(this.state.dateStr)}/>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
