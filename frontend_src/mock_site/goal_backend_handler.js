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
            {'id': MockGoalId.NODEJS_MIGRATION, 'name': 'Backend NodeJS Migration'},
            {'id': MockGoalId.INTEGRATED_TESTS, 'name': 'Integrated testing'},
            {'id': MockGoalId.TOP_SECRET, 'name': 'Top Secret'}
        ];
    }

    allGoalsRouteHandler = (method, data) =>  /* eslint-disable-line no-unused-vars */
    {
        if (method !== 'GET')
        {
            throw `Invalid /all_goals method ${method}`;
        }

        return {'goals': this.data};
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

    getGoalNameFromId = (goalId) =>
    {
        for (let goal of this.data)
        {
            if (goal.id === goalId)
            {
                return goal.name;
            }
        }

        throw `Could not find matching goal for id ${goalId}`;
    }
}

let GoalBackendHandler = new GoalBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/all_goals', GoalBackendHandler.allGoalsRouteHandler);
BackendAjaxHandler.addAjaxRouteHandler('/goal', GoalBackendHandler.goalRoutehandler);

export {MockGoalId, GoalBackendHandler};