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
        this.props.onFieldChange('goalString', e.target.value);
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
            'fuzzySearchResults': [],
            'resultHighlightedIndex': null
        };
    }

    _handleChange = (e) =>
    {
        this._fuzzySearchGoals(e.target.value);
        this.props.onChange(e);
    }

    _handleKeyDown = (e) =>
    {
        if (this._goalHasNoResultsOrIsExistingGoal())
        {
            this.props.onKeyDown(e);
            return;
        }

        const numResults = this.state.fuzzySearchResults.length;
        let resultHighlightedIndex = this.state.resultHighlightedIndex;
        if (resultHighlightedIndex >= numResults)
        {
            resultHighlightedIndex = null;
        }

        switch (e.key)
        {
        case 'ArrowUp':
        case 'ArrowDown':
            if (resultHighlightedIndex === null)
            {
                this.setState({'resultHighlightedIndex': 0});
            }
            else
            {
                let direction = (e.key === 'ArrowDown') ? 1 : -1;
                // We add numResults to compensate for negative mods not behaving as they do in math.
                this.setState({
                    'resultHighlightedIndex': (resultHighlightedIndex + direction + numResults) % numResults}
                );
            }
            break;

        case 'Enter':
            if (resultHighlightedIndex !== null)
            {
                this._handleResultSelected(resultHighlightedIndex);
            }
            break;
        
        case 'Escape':
            this.setState({'fuzzySearchResults': []});
            break;
        }
    }

    _handleResultSelected = (index) =>
    {
        this.setState({'fuzzySearchResults': []});
        // TODO: hack because onChange expects an event, which isn't exactly correct
        this.props.onChange({'target': {'value': this.state.fuzzySearchResults[index]}});
    }

    _handleFocus = () =>
    {
        this._fuzzySearchGoals(this.props.value);
    }

    _handleBlur = () =>
    {
        this.setState({'fuzzySearchResults': [], 'resultHighlightedIndex': null});
    }

    _fuzzySearchGoals = (goalString) =>
    {
        const fuzzySearchResultStrings = 
        fuzzysort.go(goalString, GoalManager.goals.map(goalObj => goalObj.name), {allowTypo: true})
            .map(result => result.target);
        this.setState({'fuzzySearchResults': fuzzySearchResultStrings});
    }

    _goalHasNoResultsOrIsExistingGoal = () =>
    {
        const results = this.state.fuzzySearchResults;
        return (results.length === 0) || (results.length === 1 && this.props.value === results[0]);
    }

    render()
    {
        const {onChange, onKeyDown, ...props} = this.props;  /* eslint-disable-line no-unused-vars */
        return (
            <div className="editable-task-goal-container">
                <input {...props} onKeyDown={this._handleKeyDown} onChange={this._handleChange} 
                    onFocus={this._handleFocus} onBlur={this._handleBlur}/>
                {this._renderFuzzySearchResults()}
            </div>
        );
    }

    _renderFuzzySearchResults = () =>
    {
        if (this._goalHasNoResultsOrIsExistingGoal())
        {
            return null;
        }

        const results = this.state.fuzzySearchResults;
        let resultsArray = [];
        for (let i = 0; i < results.length; ++i)
        {
            let className = 'editable-task-goal-result';
            if (i === this.state.resultHighlightedIndex)
            {
                className += ' editable-task-goal-result-selected';
            }
            
            // Interestingly, onClick doesn't get captured: this is because onClick requires a mouse release to register
            // as a click (at this point the paragraph is already gone due to the onBlur event).
            resultsArray.push(
                <p key={i} onMouseDown={() => this._handleResultSelected(i)} className={className}>{results[i]}</p>
            );
        }

        return (
            <div className='editable-task-goal-fuzzy-search-results'>
                {resultsArray}
            </div>
        );
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