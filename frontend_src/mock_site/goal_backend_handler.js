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
        this.goalId = Math.max(...Object.values(MockGoalId));  // ensure no id reuse
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
            return this._handleGoalPost(data);

        case 'PUT':
            return this._handleGoalPut(data);

        case 'DELETE':
            return this._handleGoalDelete(data);
        
        default:
            throw `Invalid /goal method ${method}`;
        }
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

    _handleGoalPost = (data) =>
    {
        data['id'] = ++this.goalId;
        this.data.push(data);
        return {'success': true};
    }

    _handleGoalPut = (data) =>
    {
        let modifyGoal = this._findGoalForId(data.id)[1];
        for (const key in data)
        {
            modifyGoal[key] = data[key];
        }
        return data;
    }

    _handleGoalDelete = (data) =>
    {
        let deleteGoalIndex = this._findGoalForId(data.id)[0];
        this.data.splice(deleteGoalIndex, 1);
        return {'success': true};
    }

    _findGoalForId = (goalId) =>
    {
        for (let [index, goal] of this.data.entries())
        {
            if (goal.id === goalId)
            {
                return [index, goal];
            }
        }

        throw `Unknown goal id ${goalId}`;
    }
}

let GoalBackendHandler = new GoalBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/all_goals', GoalBackendHandler.allGoalsRouteHandler);
BackendAjaxHandler.addAjaxRouteHandler('/goal', GoalBackendHandler.goalRoutehandler);

export {MockGoalId, GoalBackendHandler};