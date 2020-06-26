import {ajaxGet} from '../ajax.js';

class GoalManagerClass
{
    constructor()
    {
        this.goals = [];
        this.listenerCallbacks = [];

        this.refreshGoals = this.refreshGoals.bind(this);
        this.addListenerCallback = this.addListenerCallback.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    refreshGoals()
    {
        ajaxGet('/all_goals', {})
            .done((data) => this.onChange(data['goals']));
    }

    addListenerCallback(cb)
    {
        this.listenerCallbacks.push(cb);
    }

    onChange(goals)
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