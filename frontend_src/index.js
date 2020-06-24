import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

import TaskEntryForm from './task_entry_form.js';
import TaskView from './task_view.js';

$(document).ajaxError((event, jqXHR, settings, exception) => {
    const errorText = `"${settings.type}" request to URL "${settings.url}" failed ` +
                        `with status ${jqXHR.status}, "${exception}"`;
    console.error(errorText);
    if (jqXHR.hasOwnProperty('responseJSON'))
    {
        console.error(jqXHR.responseJSON['error']);
    }
});

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        // TODO: duplicated
        const YYYY_MM_DD_LENGTH = 10; // 2020-06-22
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
        // TODO: abstract the AJAX out
        $.ajax('/date_tasks', {
            data: {'date': dateStr},
            method: 'GET',
            processData: true
        }).done((data) => this.setState({'tasks': data['tasks']}));
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
