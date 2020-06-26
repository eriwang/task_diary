import React from 'react';

import Status from './status.js';

export class TextInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.instanceId = TextInput.id++;
    }

    render()
    {
        const elementId = `entry-text-input-${this.instanceId}`;
        let textInputElement = (this.props.isMultiLine === undefined) ?
            <input type="text" id={elementId} onChange={this.props.onChange} value={this.props.value} /> : 
            <textarea id={elementId} onChange={this.props.onChange} value={this.props.value}
                className="entry-textarea" />;
        return (
            <div className="entry-multi-row-field">
                <label htmlFor={elementId}>{this.props.label}</label>
                {textInputElement}
            </div>
        );
    }
}
TextInput.id = 0;  // static

export class DropdownInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.instanceId = DropdownInput.id++;
    }

    render()
    {
        const elementId = `entry-dropdown-input-${this.instanceId}`;
        const options = this.props.options.map((d) => <option key={d.id} value={d.value}>{d.label}</option>);
        const select = (
            <select id={elementId} value={this.props.value}
                onChange={(event) => this.props.onChange(event.target.value)}>
                {options}
            </select>
        );

        if (this.props.label === undefined)
        {
            return select;
        }

        return (
            <div className="entry-single-row-field">
                <label htmlFor={elementId}>{this.props.label}</label>
                {select}
            </div>
        );
    }
}
DropdownInput.id = 0; // static

export class StatusInput extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const options = [
            {'id': Status.NOT_STARTED, 'value': Status.NOT_STARTED, 'label': 'Not Started'},
            {'id': Status.IN_PROGRESS, 'value': Status.IN_PROGRESS, 'label': 'In Progress'},
            {'id': Status.COMPLETE, 'value': Status.COMPLETE, 'label': 'Complete'},
            {'id': Status.DROPPED, 'value': Status.DROPPED, 'label': 'Dropped'}
        ];
        return <DropdownInput options={options} {...this.props}/>;
    }
}

export class CheckboxInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.instanceId = CheckboxInput.id++;
    }

    render()
    {
        const elementId = `entry-checkbox-input-${this.instanceId}`;
        return (
            <div className="entry-single-row-field">
                <label htmlFor={elementId}>{this.props.label}</label>
                <input type="checkbox" id={elementId} checked={this.props.checked} 
                    onChange={(e) => this.props.onCheckedChange(e.target.checked)}/>
            </div>
        );
    }
}
CheckboxInput.id = 0; // static
