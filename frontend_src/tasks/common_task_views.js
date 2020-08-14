import fuzzysort from 'fuzzysort';
import React from 'react';

import {DropdownButton} from '../common/svg_buttons.js';
import {StatusInput} from '../common/form_components.js';
import GoalManager from '../state_managers/goal_manager.js';

class CommonEditableTaskView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    // It may be worth extracting the key presses and inputs to another component (for example something like the form
    // components, but without enforced row styling). For now leaving these here since this is the only component that
    // actually uses these features.
    _handleKeyDown = (e) =>
    {
        if (e.key === 'Enter' && this.props.onEnterPressed !== undefined)
        {
            this.props.onEnterPressed();
        }
        else if (e.key === 'Escape' && this.props.onEscapePressed !== undefined)
        {
            this.props.onEscapePressed();
        }
    }

    _handleGoalChange = (e) =>
    {
        const goalString = e.target.value;
        const fuzzySearchResults = fuzzysort.go(goalString, GoalManager.goals, {key: 'name'});
        console.log(fuzzySearchResults);
        this.props.onFieldChange('goalString', goalString);
    }

    render()
    {
        const nameComponent = 
            <input autoFocus={this.props.autoFocus} className="task-name" placeholder="Name" value={this.props.name}
                onKeyDown={this._handleKeyDown} onChange={(e) => this.props.onFieldChange('name', e.target.value)}/>;
        const goalComponent = 
            <GoalAutoCompleteInput placeholder="Goal" value={this.props.goalString} onKeyDown={this._handleKeyDown}
                onChange={(e) => this.props.onFieldChange('goalString', e.target.value)}/>;
        
        // Enter and escape on dropdowns are used to toggle the select options themselves, so I don't want to add enter/
        // escape handlers.
        const statusComponent =
            <StatusInput value={this.props.status}
                onChange={(value) => this.props.onFieldChange('status', parseInt(value))} />;
        const notesComponent = 
            <textarea className="task-notes" placeholder="Notes" value={this.props.notes}
                onKeyDown={this._handleKeyDown} onChange={(e) => this.props.onFieldChange('notes', e.target.value)}/>;

        return <CommonTaskView 
            nameComponent={nameComponent}
            goalComponent={goalComponent}
            statusComponent={statusComponent}
            notesComponent={notesComponent}
            endComponent={this.props.endComponent}
            startDetailsShown={this.props.startDetailsShown}/>;
    }
}

class GoalAutoCompleteInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'fuzzySearchResults': []
        };
    }

    _handleChange = (e) =>
    {
        const goalString = e.target.value;
        
        const fuzzySearchResultStrings = 
            fuzzysort.go(goalString, GoalManager.goals.map(goalObj => goalObj.name), {allowTypo: true})
                .map(result => result.target);
        this.setState({'fuzzySearchResults': fuzzySearchResultStrings});

        console.log(fuzzySearchResultStrings);
        this.props.onChange(e);
    }

    _handleKeyDown = (e) =>
    {
        const key = e.key;
        switch (key)
        {
        case 'ArrowUp':
            break;

        case 'ArrowDown':
            break;

        case 'Enter':
            break;
        
        case 'Escape':
            break;
        }

        this.props.onKeyDown(e);
    }

    render()
    {
        const {onChange, onKeyDown, ...props} = this.props;  /* eslint-disable-line no-unused-vars */
        return <input {...props} onKeyDown={this._handleKeyDown} onChange={this._handleChange}/>;
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
                {this.props.endComponent}
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