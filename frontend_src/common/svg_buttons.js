import React from 'react';

import {getDefaultIfUndefined} from '../utils/ternary_utils.js';

// SVG sourced from https://feathericons.com/
class SvgButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            'mouseInside': false,
        };
    }

    _handleKeyDown = (e) =>
    {
        if (e.key === 'Enter')
        {
            this.props.onClick();
        }
    }

    render()
    {
        // TODO: The isActive is a bit confusing. Should consider reevaluating how it's done.
        // TODO: isActive is from Site Script Storage play button, for when the script is running. May not need this.
        // TODO: can this be 100% CSS?
        let fillColor, opacity;
        if (this.props.isActive !== undefined && this.props.isActive)
        {
            fillColor = 'gray';
            opacity = 0.5;
        }
        else
        {
            opacity = 1;
            fillColor = (this.state.mouseInside) ? 'gray' : 'none';
        }

        // Setting only width is a hack. For my use case, keeping the height at 24 means the element stays centered when
        // I decrease the size. A better solution would be to allow setting of width/ height/ viewbox.
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={getDefaultIfUndefined(this.props.size, 24)} height="24"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                fill={fillColor} opacity={opacity} className="svg-button" tabIndex="0"
                onMouseEnter={() => this.setState({'mouseInside': true})}
                onMouseLeave={() => this.setState({'mouseInside': false})}
                onClick={this.props.onClick}
                onKeyDown={this._handleKeyDown}>
                {this.props.children}
            </svg>
        );
    }
}

// check-square feather icon
class CheckButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                <polyline points="9 11 12 14 22 4" />
            </SvgButton>
        );
    }
}

// x-square feather icon
class CrossButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
            </SvgButton>
        );
    }
}

// triangle feather icon
class DropdownButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const transform = (this.props.isDropped) ? 'scale(1, -1)' : '';
        return (
            <SvgButton size="16" onClick={this.props.onClick}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    transform={transform} transform-origin="center"/>
            </SvgButton>
        );
    }
}

// edit feather icon
class EditButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </SvgButton>
        );
    }
}

// calendar feather icon
class CalendarButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </SvgButton>
        );
    }
}

// menu feather icon
class MenuButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </SvgButton>
        );
    }
}

export {CheckButton, CrossButton, DropdownButton, EditButton, CalendarButton, MenuButton};
