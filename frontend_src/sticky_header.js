import React from 'react';

import {MenuButton} from './common/svg_buttons.js';
import HeaderDateSelector from './header_date_selector.js';

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
                <div className="header-other">
                    <h1>Task Diary</h1>
                    <HeaderDateSelector onChange={this.props.onDateChange} value={this.props.dateStr} />
                </div>
            </div>
        );
    }
}