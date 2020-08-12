import React from 'react';

// Ideally, I'd be able to have the date and a custom feather calendar selector icon that makes the calednar pop up. I
// ended up using the date input (at least for now) because the text handling is very nice (able to focus on individual)
// fields, change using arrow keys, when you type "mmddyyyy" without slashes it fixes it for you...)
// It's also a bit more difficult to style the HTML5 date input (e.g. Chromium browsers have a built in calendar, 
// Firefox has a clear button) consistently across browsers.
export default class HeaderDateSelector extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <input className="header-date-selector" type="date" 
                onChange={this.props.onChange} value={this.props.value} required/>
        );
    }
}