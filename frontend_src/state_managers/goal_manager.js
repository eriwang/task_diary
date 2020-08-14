import {ajaxGet, ajaxPost} from '../common/ajax.js';

class GoalManagerClass
{
    constructor()
    {
        this.goals = [];
        this.listenerCallbacks = [];
    }

    refreshGoals = () =>
    {
        ajaxGet('/all_goals', {})
            .done((data) => this._onChange(data['goals']));
    }

    addGoal = (name) =>
    {
        return ajaxPost('/goal', {'name': name}).done(this.refreshGoals);
    }

    addListenerCallback = (cb) =>
    {
        this.listenerCallbacks.push(cb);
    }

    getGoalIdFromName = (name) =>
    {
        if (name === '')
        {
            return -1;
        }

        for (let goal of this.goals)
        {
            if (goal.name === name)
            {
                return goal.id;
            }
        }
        throw `Goal id for name ${name} not found`;
    }

    _onChange = (goals) =>
    {
        this.goals = goals;
        for (const cb of this.listenerCallbacks)
        {
            cb(this.goals);
        }
    }
}

let GoalManager = new GoalManagerClass();
export default GoalManager;
