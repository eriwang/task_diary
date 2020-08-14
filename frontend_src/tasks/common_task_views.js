import React from 'react';

import {DropdownButton} from '../common/svg_buttons.js';
import {StatusInput} from '../common/form_components.js';

class CommonEditableTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const nameComponent = 
            <input className="task-name" placeholder="Name" value={this.props.name} 
                onChange={(e) => this.props.onFieldChange('name', e.target.value)}/>;
        const goalComponent =
            <input placeholder="Goal" value={this.props.goalString} 
                onChange={(e) => this.props.onFieldChange('goalString', e.target.value)}/>;
        const statusComponent =
            <StatusInput value={this.props.status}
                onChange={(value) => this.props.onFieldChange('status', parseInt(value))} />;
        const notesComponent = 
            <textarea className="task-notes" placeholder="Notes" value={this.props.notes}
                onChange={(e) => this.props.onFieldChange('notes', e.target.value)}/>;

        return <CommonTaskView 
            nameComponent={nameComponent}
            goalComponent={goalComponent}
            statusComponent={statusComponent}
            notesComponent={notesComponent}
            buttonsComponent={this.props.buttonsComponent}
            startDetailsShown={this.props.startDetailsShown}/>;
    }
}

class CommonTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'areDetailsHidden': (props.startDetailsShown === undefined)};
    }

    _handleToggleDetails = () =>
    {
        this.setState((state) => {
            return {'areDetailsHidden': !state.areDetailsHidden};
        });
    }

    render()
    {
        const hideableComponent = this.state.areDetailsHidden ? null : (
            <div className="task-hideable-container">
                {this.props.notesComponent}
                {this.props.buttonsComponent}
            </div>
        );

        return (
            <div className="task-container">
                <div className="task">
                    <div className="task-always-shown">
                        <div className="task-name-goal-container">
                            {this.props.nameComponent}
                            {this.props.goalComponent}
                        </div>
                        <div className="task-flush-right-container">
                            {this.props.statusComponent}
                        </div>
                    </div>
                    {hideableComponent}
                </div>
                <div className="task-dropdown-button">
                    <DropdownButton onClick={this._handleToggleDetails} isDropped={!this.state.areDetailsHidden}/>
                </div>
            </div>
        );
    }
}

export {CommonEditableTaskView, CommonTaskView};