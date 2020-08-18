import BackendAjaxHandler from './backend_ajax_handler.js';

class GoalBackendHandlerClass
{
    constructor()
    {
    }

    allGoalsRouteHandler = (method, data) =>
    {
        if (method !== 'GET')
        {
            throw `Invalid /all_goals method ${method}`;
        }
        console.log(data);
        return null;
    }

    goalRoutehandler = (method, data) =>
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
            throw `Invalid /goal method ${method}`;
        }

        console.log(data);
        return null;
    }
}

let goalBackendHandler = new GoalBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/all_goals', goalBackendHandler.allGoalsRouteHandler);
BackendAjaxHandler.addAjaxRouteHandler('/goal', goalBackendHandler.goalRoutehandler);