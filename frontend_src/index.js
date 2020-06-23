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
        this.state = {'tasks': []};

        this.refreshTasks = this.refreshTasks.bind(this);
        this.populateTasks = this.populateTasks.bind(this);
    }

    componentDidMount()
    {
        this.refreshTasks();
    }

    refreshTasks()
    {
        $.get('/all_tasks').done(this.populateTasks);   
    }

    populateTasks(data)
    {
        this.setState({'tasks': data['tasks']});
    }

    render()
    {
        return (
            <div id="center-view">
                <TaskView tasks={this.state.tasks} />
                <TaskEntryForm onTaskEntrySuccessful={this.refreshTasks}/>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
