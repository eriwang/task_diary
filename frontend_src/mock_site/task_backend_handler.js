import {getDateStr, getTodayPlusDelta} from '../utils/date_utils.js';
import {MockGoalId, GoalBackendHandler} from './goal_backend_handler.js';
import BackendAjaxHandler from './backend_ajax_handler.js';
import Status from '../common/status.js';

class TaskBackendHandlerClass
{
    constructor()
    {
        const yesterdayDateStr = getDateStr(getTodayPlusDelta(-1));
        const todayDateStr = getDateStr(new Date());
        const tomorrowDateStr = getDateStr(getTodayPlusDelta(1));

        this.taskId = 0;
        this.data = [
            {
                'id': ++this.taskId,
                'date': yesterdayDateStr,
                'name': 'Hack in all Flask routes as NodeJS and Express routes instead',
                'status': Status.COMPLETE,
                'is_planned': true,
                'notes': 'No database logic for now, just return valid dummy data',         
                'goal_id': MockGoalId.NODEJS_MIGRATION
            },
            {
                'id': ++this.taskId,
                'date': yesterdayDateStr,
                'name': 'Clean up routing code',
                'status': Status.COMPLETE,
                'is_planned': true,
                'notes': '',
                'goal_id': MockGoalId.NODEJS_MIGRATION
            },
            {
                'id': ++this.taskId,
                'date': yesterdayDateStr,
                'name': 'Secure a route to the treasure room',
                'status': Status.COMPLETE,
                'is_planned': true,
                'notes': 'Looking',
                'goal_id': MockGoalId.TOP_SECRET
            },
            {
                'id': ++this.taskId,
                'date': yesterdayDateStr,
                'name': 'Make some curry',
                'status': Status.COMPLETE,
                'is_planned': false,
                'notes': '',
                'goal_id': MockGoalId.NONE
            },
            {
                'id': ++this.taskId,
                'date': todayDateStr,
                'name': 'Convert database logic to use NodeJS',
                'is_planned': true,
                'status': Status.IN_PROGRESS,
                'notes': 'Try looking into the node sqlite3 module (https://www.npmjs.com/package/sqlite3)',
                'goal_id': MockGoalId.NODEJS_MIGRATION,
            },
            {
                'id': ++this.taskId,
                'date': todayDateStr,
                'name': 'Read up on different headless browsers, APIs for controlling them',
                'is_planned': true,
                'status': Status.NOT_STARTED,
                'notes': 'Selenium? Puppeteer + Chrome? PhantomJS development suspended?',
                'goal_id': MockGoalId.INTEGRATED_TESTS,
            },
            {
                'id': ++this.taskId,
                'date': todayDateStr,
                'name': 'Fix bugs from routing cleanup',
                'is_planned': false,
                'status': Status.COMPLETE,
                'notes': 'Oops',
                'goal_id': MockGoalId.NODEJS_MIGRATION,
            },
            {
                'id': ++this.taskId,
                'date': todayDateStr,
                'name': 'Grocery run',
                'is_planned': false,
                'status': Status.COMPLETE,
                'notes': 'Somehow ran out of rice... also needed to buy more curry ingredients',
                'goal_id': MockGoalId.NONE,
            },
            {
                'id': ++this.taskId,
                'date': todayDateStr,
                'name': 'Send the calling card',
                'status': Status.COMPLETE,
                'is_planned': true,
                'notes': 'Cool',
                'goal_id': MockGoalId.TOP_SECRET
            },
            {
                'id': ++this.taskId,
                'date': tomorrowDateStr,
                'name': 'Select a headless browser, write tests for validating task view looks as expected',
                'is_planned': true,
                'status': Status.NOT_STARTED,
                'notes': '',
                'goal_id': MockGoalId.INTEGRATED_TESTS,
            },
            {
                'id': ++this.taskId,
                'date': tomorrowDateStr,
                'name': 'Steal the treasure!',
                'status': Status.NOT_STARTED,
                'is_planned': true,
                'notes': 'Joker',
                'goal_id': MockGoalId.TOP_SECRET
            },
        ];
    }

    dateTasksRouteHandler = (method, data) =>
    {
        if (method !== 'GET')
        {
            throw `Invalid /date_tasks method ${method}`;
        }

        let dateTasks = [];
        this.data.forEach((task) => {
            if (task.date !== data['date'])
            {
                return;
            }

            let newTask = {...task};
            if (newTask.goal_id === MockGoalId.NONE)
            {
                delete newTask.goal_id;
            }
            else
            {
                newTask.goal = GoalBackendHandler.getGoalNameFromId(newTask.goal_id);
            }

            dateTasks.push(newTask);
        });

        return {'tasks': dateTasks};
    }

    taskRouteHandler = (method, data) =>
    {
        switch (method)
        {
        case 'POST':
            return this._handleTaskPost(data);

        case 'PUT':
            return this._handleTaskPut(data);

        case 'DELETE':
            return this._handleTaskDelete(data);
        
        default:
            throw `Invalid /tasks method ${method}`;
        }
    }

    _handleTaskPut = (data) =>
    {
        let modifyTask = this._findTaskForId(data.id)[1];
        for (const key in data)
        {
            modifyTask[key] = data[key];
        }
        return data;
    }

    _handleTaskPost = (data) =>
    {
        data['id'] = ++this.taskId;
        this.data.push(data);
        return {'success': true};
    }

    _handleTaskDelete = (data) =>
    {
        let deleteTaskIndex = this._findTaskForId(data.id)[0];
        this.data.splice(deleteTaskIndex, 1);
        return {'success': true};
    }

    _findTaskForId = (taskId) =>
    {
        for (let [index, task] of this.data.entries())
        {
            if (task.id === taskId)
            {
                return [index, task];
            }
        }

        throw `Unknown task id ${taskId}`;
    }
}

let TaskBackendHandler = new TaskBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/date_tasks', TaskBackendHandler.dateTasksRouteHandler);
BackendAjaxHandler.addAjaxRouteHandler('/task', TaskBackendHandler.taskRouteHandler);