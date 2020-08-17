import React from 'react';

import {MenuButton} from './common/svg_buttons.js';
import HeaderDateSelector from './header_date_selector.js';
import OngoingChangeRequestTracker from './state_trackers/ongoing_change_request_tracker.js';

export default class StickyHeader extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className="sticky-header">
                <div className="header-sidebar-toggle-btn">
                    <MenuButton onClick={this.props.onMenuClick}/>
                </div>
                <div className="header-content">
                    <h1>Task Diary</h1>
                    <div className="header-flush-right">
                        <SaveIndicator />
                        <HeaderDateSelector onChange={this.props.onDateChange} value={this.props.dateStr} />
                    </div>
                </div>
            </div>
        );
    }
}

// save feather icon
class SaveIndicator extends React.Component
{
    constructor(props)
    {
        super(props);
        this.animationCallbackIntervalId = null;
        this.state = {
            'requestsAreInProgress': false,
            'opaque': false,
        };
    }

    componentDidMount()
    {
        OngoingChangeRequestTracker.addListenerCallback(this._handleChangeRequestStatusChange);
    }

    _handleChangeRequestStatusChange = (requestsAreInProgress) =>
    {
        let stateChange = {'requestsAreInProgress' : requestsAreInProgress};
        if (requestsAreInProgress && this.animationCallbackIntervalId === null)
        {
            stateChange['opaque'] = true;
            this.animationCallbackIntervalId = setInterval(this._handleAnimationOnInterval, 750);
        }

        this.setState(stateChange);
    }

    _handleAnimationOnInterval = () =>
    {
        if (this.state.requestsAreInProgress)
        {
            this.setState(state => {return {'opaque': !state.opaque};});
            return;
        }

        if (this.state.opaque)
        {
            // We intentionally loop one more time so we can actually clear the callback when the icon has disappeared.
            this.setState({'opaque': false});
        }
        else
        {
            clearInterval(this.animationCallbackIntervalId);
            this.animationCallbackIntervalId = null;
        }
    }

    render()
    {
        let className = 'header-save-indicator';
        if (this.state.opaque)
        {
            className += ' header-save-indicator-opaque';
        }

        // TODO: bit of duplicate from svg buttons
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={className}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
            </svg>
        );
    }
}