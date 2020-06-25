import React from 'react';

import StatusDropdown from './status_dropdown.js';

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

export class StatusInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.instanceId = StatusInput.id++;
    }

    render()
    {
        const elementId = `entry-status-input-${this.instanceId}`;
        return (
            <div className="entry-single-row-field">
                <label htmlFor={elementId}>Status</label>
                <StatusDropdown id={elementId} status={this.props.status} onStatusChange={this.props.onStatusChange} />
            </div>
        );
    }
}
StatusInput.id = 0; // static

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
