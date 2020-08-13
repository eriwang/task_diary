import React from 'react';

import {StatusInput} from '../common/form_components.js';
import Status from '../common/status.js';

export default class TaskEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'name': '',
            'notes': '',
            'goalString': '',
            'status': Status.NOT_STARTED
        };
    }

    _handleFieldChange = (fieldName, value) =>
    {
        const newState = {};
        newState[fieldName] = value;
        this.setState(newState);
    }

    _handleSubmit = () =>
    {
        let data = {
            'name': this.state.name,
            'goal': -1,  // FIXME: populate based on goalString lookup. validate if does not exist
            'is_planned': this.props.is_planned,
            'status': this.props.status,
            'notes': this.state.notes,
        };

        this.props.onSubmitTask(data);
    }

    // TODO: ideally this'd get unified with the actual task element rendering logic/ CSS/ whatnot. Right now I'm just
    //       stealing all the CSS classes and general HTML element structure from there
    render()
    {
        return (
            <div className="task-container">
                <div className="task">
                    <div className="task-always-shown">
                        <div className="task-name-goal-container">
                            <input className="task-name" placeholder="Name" value={this.state.name}
                                onChange={(e) => this._handleFieldChange('name', e.target.value)}/>
                            <input placeholder="Goal" value={this.state.goalString}
                                onChange={(e) => this._handleFieldChange('goalString', e.target.value)}/>
                        </div>
                        <div className="task-flush-right-container">
                            <StatusInput value={this.state.status}
                                onChange={(value) => this._handleFieldChange('status', parseInt(value))} />
                        </div>
                    </div>
                    <div className="task-hideable-container">
                        <textarea placeholder="Notes" value={this.state.notes}
                            onChange={(e) => this._handleFieldChange('notes', e.target.value)}/>
                        <div className="task-modification-container">
                            <button onClick={this._handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
                <div className="task-dropdown-button">
                </div>
            </div>
        );
    }
}