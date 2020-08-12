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
