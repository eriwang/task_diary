import BackendAjaxHandler from './backend_ajax_handler.js';

const MockGoalId = Object.freeze({
    'NONE': -1,
    'NODEJS_MIGRATION': 0,
    'INTEGRATED_TESTS': 1,
    'TOP_SECRET': 2
});

class GoalBackendHandlerClass
{
    constructor()
    {
        this.data = [
            
        ];
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

export {MockGoalId};