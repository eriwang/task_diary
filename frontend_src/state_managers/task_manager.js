import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from '../common/ajax.js';

class TaskManagerClass
{
    constructor()
    {
        this.dateStr = null;
        this.listenerCallbacks = [];
    }

    refreshTasks = () => 
    {
        ajaxGet('/date_tasks', {'date': this.dateStr})
            .done((data) => this._onChange(data['tasks']));
    }

    changeDateAndRefresh = (dateStr) =>
    {
        this.dateStr = dateStr;
        this.refreshTasks();
    }

    addTask = (taskData) =>
    {
        // The new task UI doesn't know about the date, so we add it in here for the API call.
        if (taskData['date'] === undefined)
        {
            taskData['date'] = this.dateStr;
        }

        return ajaxPost('/task', taskData).done(this.refreshTasks);
    }

    editTask = (taskData) =>
    {
        return ajaxPut('/task', taskData).done(this.refreshTasks);
    }

    deleteTask = (taskId) =>
    {
        return ajaxDelete('/task', {'id': taskId}).done(this.refreshTasks);
    }

    addListenerCallback = (cb) =>
    {
        this.listenerCallbacks.push(cb);
    }

    _onChange = (tasks) =>
    {
        for (const cb of this.listenerCallbacks)
        {
            cb(tasks);
        }
    }
}

let TaskManager = new TaskManagerClass();
export default TaskManager;