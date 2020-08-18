import BackendAjaxHandler from './backend_ajax_handler.js';

class TaskBackendHandlerClass
{
    constructor()
    {
    }

    dateTasksRouteHandler = (method, data) =>
    {
        if (method !== 'GET')
        {
            throw `Invalid /date_tasks method ${method}`;
        }
        console.log(data);
        return null;
    }

    taskRouteHandler = (method, data) =>
    {
        switch (method)
        {
        case 'POST':
            break;

        case 'PUT':
            break;

        case 'DELETE':
            break;
        
        default:
            throw `Invalid /tasks method ${method}`;
        }

        console.log(data);
        return null;
    }
}

let taskBackendHandler = new TaskBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/date_tasks', taskBackendHandler.dateTasksRouteHandler);
BackendAjaxHandler.addAjaxRouteHandler('/task', taskBackendHandler.taskRouteHandler);